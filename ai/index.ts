import OpenAI from "openai";
import { assistantModel } from "./models/assistant";
import { Thread, ThreadDeleted } from "openai/resources/beta/threads/threads";
import { MessageContentText, MessageCreateParams, ThreadMessage } from "openai/resources/beta/threads/messages/messages";
import { Assistant } from "openai/resources/beta/assistants/assistants";
import { Run, RunSubmitToolOutputsParams } from "openai/resources/beta/threads/runs/runs";
import { func_call } from "./custom_tools";
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
    if (threadId) {
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

export async function createRun(thread: Thread, assistant: Assistant): Promise<Run> {
    console.log(assistant);
    return await openai.beta.threads.runs.create(thread.id, { assistant_id: assistant.id });
}

export async function checkStatusAndGetMessages(thread: Thread, run: Run) {

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    if (runStatus.status === "completed") {
        // console.log("completed");
        let { data } = await openai.beta.threads.messages.list(thread.id);
        const message = data?.reverse().map((msg) => {
            const role = msg.role;
            const content = msg.content[0] as MessageContentText;

            return Object.freeze({ role: role.slice(1), message: content.text.value })
        })

        return Object.freeze({
            status: runStatus.status,
            message
        });

    } else if (runStatus.status === "requires_action") {
        console.log("requires_action");
        const requiredAction = runStatus.required_action?.submit_tool_outputs.tool_calls;
        console.log(requiredAction);
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
        console.log(tool_outputs);
        const result = await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, { tool_outputs });
        console.log(result);
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
        deleteThread
    })
}

// init(process.env.OPENAI_ASST_KEY).then(async (ICPAssistantAI) => {

//     const thread = await ICPAssistantAI.createThread();

//     await ICPAssistantAI.createMessage(thread, {
//         role: "user",
//         // content: "generate a identity from seed 'soldier reform switch latin soon plunge lift betray tag quarter perfect need hospital upon sponsor indicate evolve blast kiss bundle square defense wild unveil', and then get the icp token address, then get the ckbtc address, then get the ckbtc balance"
//         content: "generate a identity from the seed 'chronic gift fame sibling youth motor catch rocket glove chief ticket crisp bundle million leopard genre buyer uniform cushion file drift ahead explain cave', then use the principal to get an ICP account address, after check the balance of ICP token of the account",
//         // content: "generate a identity from the seed 'chronic gift fame sibling youth motor catch rocket glove chief ticket crisp bundle million leopard genre buyer uniform cushion file drift ahead explain cave', then use the principal to get an ICP account address, after check the balance of ICP token of the account, then transfer 2 ICP to address '6c68a28687bab21578d78a64f705cdb09ab1af8837a09c825c9ff3c8f3409b65', then check balance of the icp account after the again after the transfer",
//     });
//     const run = await ICPAssistantAI.createRun(thread);

//     const message = await ICPAssistantAI.checkStatusAndGetMessages(thread, run);

//     console.log(message);
//     console.log("done");
// }).catch(console.log)


// let runStatus = "";
// while (runFinishStates.includes(runStatus)) {
//     await new Promise((resolve) => setTimeout(resolve, 8000));
//     console.log("next check");
//     console.log("================");
//     runStatus = await checkStatusAndPrintMessages(thread, run);
// }



