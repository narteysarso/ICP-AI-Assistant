import OpenAI from "openai";
import { assistantModel } from "./models/assistant";
import { Thread, ThreadDeleted } from "openai/resources/beta/threads/threads";
import { MessageContentText, MessageCreateParams, ThreadMessage } from "openai/resources/beta/threads/messages/messages";
import { Assistant } from "openai/resources/beta/assistants/assistants";
import { Run, RunSubmitToolOutputsParams } from "openai/resources/beta/threads/runs/runs";
import { func_call } from "./custom_tools";
import { isValidThreadId } from "./utils/helpers";
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const runFinishStates = ["failed", "cancelled", "expired"]

export async function createAssistant(assistantId?: string): Promise<Assistant> {
    let assistant;
    if (assistantId) {
        assistant = await openai.beta.assistants.retrieve(assistantId);
    }
    if (!assistant) {
        assistant = await openai.beta.assistants.create(assistantModel);
    }
    return assistant;
}

export async function createThread(threadId?: string): Promise<Thread> {
    let thread;
    if (threadId && isValidThreadId(threadId)) {
        thread = await openai.beta.threads.retrieve(threadId);
    }
    if (!thread) {
        thread = await openai.beta.threads.create();
    }
    return thread;
}

export async function createMessage(thread: Thread, message: MessageCreateParams): Promise<ThreadMessage> {
    return await openai.beta.threads.messages.create(thread.id, message);
}

export async function getThreadMessages(thread_id: string): Promise<ThreadMessage[]>{
    const { data: threadMessages } = await openai.beta.threads.messages.list(thread_id);

    return threadMessages;
}

export async function createRun(thread: Thread, assistant: Assistant): Promise<Run> {
    console.log(assistant);
    return await openai.beta.threads.runs.create(thread.id, { assistant_id: assistant.id });
}

export async function checkStatusAndGetMessages(thread: Thread, run: Run) {

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    if (runStatus.status === "completed") {
        // console.log("completed");
        let { data } = await openai.beta.threads.messages.list(thread.id);
       

        return Object.freeze({
            status: runStatus.status,
            data
        });

    } else if (runStatus.status === "requires_action") {
        // console.log("requires_action");
        const requiredAction = runStatus.required_action?.submit_tool_outputs.tool_calls;
        // console.log(requiredAction);
        const tools_calls = requiredAction?.map(async (action) => {
            try {
                const output = await func_call(action.function.name, JSON.parse(action.function.arguments));

                return ({
                    tool_call_id: action.id,
                    output
                });

            } catch (error) {
                return ({
                    tool_call_id: action.id,
                    output: null
                });
            }
        }) as RunSubmitToolOutputsParams.ToolOutput[]

        const tool_outputs = await Promise.all(tools_calls);
        // console.log(tool_outputs);
        const result = await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, { tool_outputs });
        // console.log(result);
    }

    if (runFinishStates.includes(runStatus.status)) {
        return Object.freeze({
            status: runStatus.status,
        });
    }

    await new Promise((resolve) => setTimeout(resolve, 8000));
    return await checkStatusAndGetMessages(thread, run);
}

export async function deleteThread(thread_id:string): Promise<ThreadDeleted>{
    return await openai.beta.threads.del(thread_id)
}

export default async function init(assistant_id?: string) {
    const assistant = await createAssistant(assistant_id);

    return Object.freeze({
        assistant,
        createMessage: async (thread: Thread, message: MessageCreateParams) => await createMessage(thread, message),
        createThread: async (thread_id?: string) => await createThread(thread_id),
        createRun: async (thread: Thread) => await createRun(thread, assistant),
        checkStatusAndGetMessages: async (thread: Thread, run: Run) => await checkStatusAndGetMessages(thread, run),
        getThreadMessages,
        deleteThread
    })
}