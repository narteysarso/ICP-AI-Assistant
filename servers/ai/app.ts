import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import init from "./index";
import { isValidThreadId } from "./utils/helpers";
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages";

require("dotenv").config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: process.env.ALLOWED_ORIGINS?.split(",")
	}
});
const port = parseInt(process.env.WS_PORT as string) || 3090;
const cacheThread = process.env.CACHE_THREAD || true;
const socketThreadMap: Map<string, string> = new Map();

init().then(
	(ICPAssistantAI) => {
		io.on("connection", (socket: Socket) => {
			console.log("New user connected");

			socket.on("message", async (data: { message: string, thread_id: string }, callback = (e?: any) => { }) => {
				try {
					// Add the user message to the conversation history

					const { message, thread_id } = data;

					if (!message) return socket.emit("message", { status: "error", message: "invalid message content" });

					const thread = await ICPAssistantAI.createThread(thread_id);

					socketThreadMap.set(socket.id, thread.id);


					await ICPAssistantAI.createMessage(thread, {
						role: "user",
						content: message

					});

					const run = await ICPAssistantAI.createRun(thread);

					const response = await ICPAssistantAI.checkStatusAndGetMessages(thread, run);

					socket.emit("message", response);
					callback();
				} catch (error: any) {
					console.error(error);
					callback(`Error: ${error.message}`);
				}
			});
			socket.on("getThreadMessages", async (thread_id: string, callback = (e?: any) => { }) => {
				try {

					if (!thread_id || !isValidThreadId(thread_id)) return socket.emit("message", { status: "error", message: "invalid thread id" });

					const threadMessages: ThreadMessage[] = await ICPAssistantAI.getThreadMessages(thread_id);

					socket.emit("message", { status: 'completed', data: threadMessages });
					callback();
				} catch (error: any) {
					console.error(error);
					callback(`Error: ${error.message}`);
				}
			});

			socket.on("disconnect", async () => {
				console.log(`User disconnected`);
				if (!cacheThread) {
					const thread_id = socketThreadMap.get(socket.id);
					if (thread_id) await ICPAssistantAI.deleteThread(thread_id);
				}
			});
		})
	}
)
	.then(() => httpServer.listen(port, "localhost", () => console.log(`server ready at port ${port}`)))
	.catch(console.log);

