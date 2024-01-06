"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const serpapi_1 = require("serpapi");
require('dotenv').config({ path: ".env" });
const search = async (params) => {
    const { input } = params;
    try {
        const result = await (0, serpapi_1.getJson)({
            q: `${input} blockchain cryptocurrency`,
            safe: "active",
            api_key: process.env.SERP_API_KEY
        });
        return JSON.stringify(result);
    }
    catch (error) {
        console.log(error);
        return `Error: ${error.message}`;
    }
};
exports.search = search;
