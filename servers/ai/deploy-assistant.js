import { createAssistant } from "."

// Deploy assistant directly to OpenAI
async function main(){
    const assistant = await createAssistant();

    return assistant;
};


main().then(console.log).catch(console.log);