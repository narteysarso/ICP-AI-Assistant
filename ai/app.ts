import init from ".";

require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.WS_PORT || 3090;

app.use(express.static("public"));

init().then(
    (ICPAssistantAI) => {
        io.on("connection", (socket: any) => {
            console.log("New user connected");

            // Initialize the conversation history
            const conversationHistory: { role: string, content: string }[] = [];

            socket.on("sendMessage", async (message: string, thread_id: string, callback: (e?: any) => {}) => {
                try {
                    // Add the user message to the conversation history
                    conversationHistory.push({ role: "user", content: message });

                    const thread = await ICPAssistantAI.createThread();

                    await ICPAssistantAI.createMessage(thread, {
                        role: "user",
                        content: message

                    });
                    const run = await ICPAssistantAI.createRun(thread);

                    const response = await ICPAssistantAI.checkStatusAndGetMessages(thread, run);

                    console.log(response);

                    // const completion = await openai.createChatCompletion({
                    //     model: "gpt-4",
                    //     messages: conversationHistory,
                    // });

                    // const response = completion.data.choices[0].message.content;

                    // // Add the assistant's response to the conversation history
                    // conversationHistory.push({ role: "assistant", content: response });

                    socket.emit("message", response);
                    callback();
                } catch (error: any) {
                    console.error(error);
                    callback("Error: Unable to connect to the chatbot");
                }
            });

            socket.on("disconnect", () => {
                console.log(socket);
                console.log(`User disconnected`);
            });
        })
    }
)
    .then(() => server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    }))
    .catch(console.log);

