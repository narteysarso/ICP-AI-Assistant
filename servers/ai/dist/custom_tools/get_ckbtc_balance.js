"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCKBTCBalance = void 0;
const ledger_icrc_1 = require("@dfinity/ledger-icrc");
const utils_1 = require("@dfinity/utils");
const helpers_1 = require("../utils/helpers");
const principal_1 = require("@dfinity/principal");
require('dotenv').config({ path: ".env" });
const getCKBTCBalance = async (params) => {
    const { principal, mnemonic_phrase } = params;
    const HOST = process.env.CANSITER_NETWORK_HOST;
    const FLOATING_POINT = 100000000n;
    const CKBTC_LEDGER_CANISTER_ID = process.env.CKBTC_LEDGER_CANISTER_ID;
    try {
        const identity = await (0, helpers_1.identityFromSeed)(mnemonic_phrase);
        const agent = await (0, utils_1.createAgent)({
            host: HOST,
            identity,
            fetchRootKey: true,
            verifyQuerySignatures: false,
        });
        const ckbtcLedgerCanister = ledger_icrc_1.IcrcLedgerCanister.create({
            agent,
            canisterId: principal_1.Principal.from(CKBTC_LEDGER_CANISTER_ID),
        });
        const amount = await ckbtcLedgerCanister.balance({ owner: principal_1.Principal.from(principal) });
        const balance = amount / FLOATING_POINT;
        console.log(balance);
        return JSON.stringify({ balance: balance.toString(), "status": "success" });
    }
    catch (error) {
        console.log(error);
        return `Error: ${error.message}`;
    }
};
exports.getCKBTCBalance = getCKBTCBalance;
