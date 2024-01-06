"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferCKBTC = void 0;
const ledger_icrc_1 = require("@dfinity/ledger-icrc");
const utils_1 = require("@dfinity/utils");
const helpers_1 = require("../utils/helpers");
const principal_1 = require("@dfinity/principal");
require('dotenv').config({ path: ".env" });
const transferCKBTC = async (params) => {
    const { recipient_principal, mnemonic_phrase, amount } = params;
    const FLOATING_POINT = 100000000n;
    const CKBTC_LEDGER_CANISTER_ID = process.env.CKBTC_LEDGER_CANISTER_ID;
    // const HOST = 'https://8a58-154-160-23-193.ngrok-free.app/';
    const HOST = 'http://localhost:8000/';
    const amt = BigInt("1") * FLOATING_POINT;
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
        const amountE8s = BigInt(amount) * FLOATING_POINT;
        await ckbtcLedgerCanister.transfer({ to: { owner: principal_1.Principal.from(recipient_principal), subaccount: [] }, amount: amountE8s });
        return JSON.stringify({ "status": "success" });
    }
    catch (error) {
        console.log(error);
        return `Error: ${error.message}`;
    }
};
exports.transferCKBTC = transferCKBTC;
