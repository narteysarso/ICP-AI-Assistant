"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFromBaseToDesitinationCurrency = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
require('dotenv').config({ path: ".env" });
const convertFromBaseToDesitinationCurrency = async (params) => {
    const { from, to, amount } = params;
    const url = `https://currency-exchange.p.rapidapi.com/exchange?from=${from}&to=${to}&q=${amount}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
            'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
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
exports.convertFromBaseToDesitinationCurrency = convertFromBaseToDesitinationCurrency;
