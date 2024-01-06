"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const index_1 = __importDefault(require("./index"));
const helpers_1 = require("./utils/helpers");
require("dotenv").config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(",")
    }
});
const port = parseInt(process.env.WS_PORT) || 3090;
const cacheThread = process.env.CACHE_THREAD || true;
const socketThreadMap = new Map();
(0, index_1.default)().then((ICPAssistantAI) => {
    io.on("connection", (socket) => {
        console.log("New user connected");
        socket.on("message", async (data, callback = (e) => { }) => {
            try {
                // Add the user message to the conversation history
                const { message, thread_id } = data;
                if (!message)
                    return socket.emit("message", { status: "error", message: "invalid message content" });
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
            }
            catch (error) {
                console.error(error);
                callback(`Error: ${error.message}`);
            }
        });
        socket.on("getThreadMessages", async (thread_id, callback = (e) => { }) => {
            try {
                if (!thread_id || !(0, helpers_1.isValidThreadId)(thread_id))
                    return socket.emit("message", { status: "error", message: "invalid thread id" });
                const threadMessages = await ICPAssistantAI.getThreadMessages(thread_id);
                socket.emit("message", { status: 'completed', data: threadMessages });
                callback();
            }
            catch (error) {
                console.error(error);
                callback(`Error: ${error.message}`);
            }
        });
        socket.on("disconnect", async () => {
            console.log(`User disconnected`);
            if (!cacheThread) {
                const thread_id = socketThreadMap.get(socket.id);
                if (thread_id)
                    await ICPAssistantAI.deleteThread(thread_id);
            }
        });
    });
})
    .then(() => httpServer.listen(port, "localhost", () => console.log(`server ready at port ${port}`)))
    .catch(console.log);
