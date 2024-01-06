"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomPhrase = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bip39 = require("bip39");
const getRandomPhrase = () => {
    try {
        // author: https://github.com/jprichardson
        const randomBytes = crypto_1.default.randomBytes(32);
        const mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex'));
        return mnemonic;
    }
    catch (error) {
        console.log(error);
        return `Error: ${error.message}`;
    }
};
exports.getRandomPhrase = getRandomPhrase;
