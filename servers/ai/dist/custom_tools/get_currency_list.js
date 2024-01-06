"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrencyList = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
require('dotenv').config({ path: ".env" });
const getCurrencyList = async () => {
    const url = 'https://currency-exchange.p.rapidapi.com/listquotes';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
            'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
        }
    };
    console.log(options);
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
exports.getCurrencyList = getCurrencyList;
