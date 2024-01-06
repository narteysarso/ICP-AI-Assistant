"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteThread = exports.checkStatusAndGetMessages = exports.createRun = exports.getThreadMessages = exports.createMessage = exports.createThread = exports.createAssistant = exports.runFinishStates = void 0;
const openai_1 = __importDefault(require("openai"));
const assistant_1 = require("./models/assistant");
const custom_tools_1 = require("./custom_tools");
const helpers_1 = require("./utils/helpers");
require('dotenv').config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
exports.runFinishStates = ["failed", "cancelled", "expired"];
async function createAssistant(assistantId) {
    let assistant;
    if (assistantId) {
        assistant = await openai.beta.assistants.retrieve(assistantId);
    }
    if (!assistant) {
        assistant = await openai.beta.assistants.create(assistant_1.assistantModel);
    }
    return assistant;
}
exports.createAssistant = createAssistant;
async function createThread(threadId) {
    let thread;
    if (threadId && (0, helpers_1.isValidThreadId)(threadId)) {
        thread = await openai.beta.threads.retrieve(threadId);
    }
    if (!thread) {
        thread = await openai.beta.threads.create();
    }
    return thread;
}
exports.createThread = createThread;
async function createMessage(thread, message) {
    return await openai.beta.threads.messages.create(thread.id, message);
}
exports.createMessage = createMessage;
async function getThreadMessages(thread_id) {
    const { data: threadMessages } = await openai.beta.threads.messages.list(thread_id);
    return threadMessages;
}
exports.getThreadMessages = getThreadMessages;
async function createRun(thread, assistant) {
    console.log(assistant);
    return await openai.beta.threads.runs.create(thread.id, { assistant_id: assistant.id });
}
exports.createRun = createRun;
async function checkStatusAndGetMessages(thread, run) {
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    if (runStatus.status === "completed") {
        // console.log("completed");
        let { data } = await openai.beta.threads.messages.list(thread.id);
        return Object.freeze({
            status: runStatus.status,
            data
        });
    }
    else if (runStatus.status === "requires_action") {
        // console.log("requires_action");
        const requiredAction = runStatus.required_action?.submit_tool_outputs.tool_calls;
        // console.log(requiredAction);
        const tools_calls = requiredAction?.map(async (action) => {
            try {
                const output = await (0, custom_tools_1.func_call)(action.function.name, JSON.parse(action.function.arguments));
                return ({
                    tool_call_id: action.id,
                    output
                });
            }
            catch (error) {
                return ({
                    tool_call_id: action.id,
                    output: null
                });
            }
        });
        const tool_outputs = await Promise.all(tools_calls);
        // console.log(tool_outputs);
        const result = await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, { tool_outputs });
        // console.log(result);
    }
    if (exports.runFinishStates.includes(runStatus.status)) {
        return Object.freeze({
            status: runStatus.status,
        });
    }
    await new Promise((resolve) => setTimeout(resolve, 8000));
    return await checkStatusAndGetMessages(thread, run);
}
exports.checkStatusAndGetMessages = checkStatusAndGetMessages;
async function deleteThread(thread_id) {
    return await openai.beta.threads.del(thread_id);
}
exports.deleteThread = deleteThread;
async function init(assistant_id) {
    const assistant = await createAssistant(assistant_id);
    return Object.freeze({
        assistant,
        createMessage: async (thread, message) => await createMessage(thread, message),
        createThread: async (thread_id) => await createThread(thread_id),
        createRun: async (thread) => await createRun(thread, assistant),
        checkStatusAndGetMessages: async (thread, run) => await checkStatusAndGetMessages(thread, run),
        getThreadMessages,
        deleteThread
    });
}
exports.default = init;
