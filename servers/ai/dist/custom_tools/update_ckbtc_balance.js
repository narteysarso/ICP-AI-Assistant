"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCKBTCBalance = void 0;
const helpers_1 = require("../utils/helpers");
const ckbtc_1 = require("@dfinity/ckbtc");
const principal_1 = require("@dfinity/principal");
const utils_1 = require("@dfinity/utils");
require('dotenv').config({ path: ".env" });
const updateCKBTCBalance = async (params) => {
    const { mnemonic_phrase } = params;
    const CKBTC_MINTER_CANISTER_ID = process.env.CKBTC_MINTER_CANISTER_ID;
    const HOST = process.env.CANSITER_NETWORK_HOST;
    try {
        const identity = await (0, helpers_1.identityFromSeed)(mnemonic_phrase);
        const agent = await (0, utils_1.createAgent)({
            host: HOST,
            identity,
            fetchRootKey: true,
            verifyQuerySignatures: false,
        });
        const ckbtcMinterCanister = ckbtc_1.CkBTCMinterCanister.create({
            agent,
            canisterId: principal_1.Principal.from(CKBTC_MINTER_CANISTER_ID),
        });
        await ckbtcMinterCanister.updateBalance({});
        return JSON.stringify({ "status": "success" });
    }
    catch (error) {
        console.log(error);
        return `Error: ${error.message}`;
    }
};
exports.updateCKBTCBalance = updateCKBTCBalance;
