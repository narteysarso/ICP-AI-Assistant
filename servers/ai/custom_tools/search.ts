import { getJson } from "serpapi";
require('dotenv').config({ path: ".env" });

export const search = async (params: { input: string }) => {
    const { input } = params;
    try {
        const result = await getJson({
            q: `${input} blockchain cryptocurrency`,
            safe: "active",
            api_key: process.env.SERP_API_KEY
        });
        
        return JSON.stringify(result);
    } catch (error: any) {
        console.log(error);
        return `Error: ${error.message}`;
    }

}
