"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getICPAddressByPrincipal = void 0;
const principal_1 = require("@dfinity/principal");
const helpers_1 = require("../utils/helpers");
const ledger_icp_1 = require("@dfinity/ledger-icp");
const getICPAddressByPrincipal = async (params) => {
    // Completely insecure seed phrase. Do not use for any purpose other than testing.
    const { mnemonic_phrase, principal } = params;
    const seed = (mnemonic_phrase.length > 12) ? mnemonic_phrase : process.env.TEST_PHRASE;
    try {
        const identity = await (0, helpers_1.identityFromSeed)(seed);
        const address = ledger_icp_1.AccountIdentifier.fromPrincipal({ principal: principal_1.Principal.from(principal) }).toHex();
        return JSON.stringify({ address, "status": "success" });
    }
    catch (error) {
        console.log(error);
        return `Error: ${error.message}`;
    }
};
exports.getICPAddressByPrincipal = getICPAddressByPrincipal;
