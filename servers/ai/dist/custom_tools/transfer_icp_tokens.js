"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferICPToken = void 0;
const ledger_icp_1 = require("@dfinity/ledger-icp");
const utils_1 = require("@dfinity/utils");
const helpers_1 = require("../utils/helpers");
const principal_1 = require("@dfinity/principal");
require('dotenv').config({ path: ".env" });
const transferICPToken = async (params) => {
    const { to, mnemonic_phrase, amount } = params;
    const FLOATING_POINT = 100000000n;
    const CANISTER_ID = process.env.ICP_LEDGER_CANISTER_ID;
    const HOST = process.env.CANSITER_NETWORK_HOST;
    try {
        const identity = await (0, helpers_1.identityFromSeed)(mnemonic_phrase);
        const agent = await (0, utils_1.createAgent)({
            host: HOST,
            identity,
            fetchRootKey: true,
            verifyQuerySignatures: false,
        });
        const ICPCanister = ledger_icp_1.LedgerCanister.create({
            agent,
            canisterId: principal_1.Principal.from(CANISTER_ID),
        });
        const amt = BigInt(amount) * FLOATING_POINT;
        await ICPCanister.transfer({
            to: ledger_icp_1.AccountIdentifier.fromHex(to),
            amount: amt
        });
        return JSON.stringify({ "status": "success" });
    }
    catch (error) {
        console.log(error);
        return `Error: ${error.message}`;
    }
};
exports.transferICPToken = transferICPToken;
