"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdentity = void 0;
const helpers_1 = require("../utils/helpers");
async function getIdentity(params) {
    const { mnemonic_phrase } = params;
    // Completely insecure seed phrase. Do not use for any purpose other than testing.
    const seed = (mnemonic_phrase.length > 12) ? mnemonic_phrase : 'test test test test test test test test test test test test';
    try {
        const identity = await (0, helpers_1.identityFromSeed)(seed);
        return JSON.stringify({
            "seed": seed,
            "principal": identity?.getPrincipal()?.toString() || "",
            "identity": identity
        });
    }
    catch (error) {
        console.log(error);
        return `Error: ${error.message}`;
    }
}
exports.getIdentity = getIdentity;
