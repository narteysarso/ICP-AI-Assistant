"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCryptoBlockchainNews = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
require('dotenv').config({ path: ".env" });
const getCryptoBlockchainNews = async () => {
    const url = 'https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk';
    const options = {
        method: 'GET',
        url: 'https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk',
        headers: {
            'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
            'X-RapidAPI-Host': 'cryptocurrency-news2.p.rapidapi.com'
        }
    };
    try {
        const response = await (0, node_fetch_1.default)(url, options);
        const text = await response.text();
        return text;
    }
    catch (error) {
        console.error(error);
        return '';
    }
};
exports.getCryptoBlockchainNews = getCryptoBlockchainNews;
