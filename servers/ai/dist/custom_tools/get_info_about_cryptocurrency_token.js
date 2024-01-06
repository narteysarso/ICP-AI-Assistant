"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCryptocurrencyTokenInfo = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
require('dotenv').config({ path: ".env" });
const getCryptocurrencyTokenInfo = async (parmas) => {
    const { symbol, slug } = parmas;
    const infoUrl = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/info";
    const url = symbol ? `${infoUrl}?symbol=${symbol}` : `${infoUrl}?slug=${slug}`;
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
exports.getCryptocurrencyTokenInfo = getCryptocurrencyTokenInfo;
