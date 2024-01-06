"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListOfLatestTokens = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
require('dotenv').config({ path: ".env" });
const getListOfLatestTokens = async (params) => {
    const { limit } = params;
    const infoUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
    const url = limit ? `${infoUrl}?limit=${limit}` : infoUrl;
    const options = {
        method: 'GET',
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        }
    };
    try {
        const response = await (0, node_fetch_1.default)(url, options);
        const result = await response.text();
        return result;
    }
    catch (error) {
        console.error(error);
        return '';
    }
};
exports.getListOfLatestTokens = getListOfLatestTokens;
