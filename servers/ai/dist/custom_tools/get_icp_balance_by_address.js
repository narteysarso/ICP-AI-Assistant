"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getICPBalanceByAddress = void 0;
const helpers_1 = require("../utils/helpers");
const ledger_icp_1 = require("@dfinity/ledger-icp");
const utils_1 = require("@dfinity/utils");
const principal_1 = require("@dfinity/principal");
require('dotenv').config({ path: ".env" });
const getICPBalanceByAddress = async (params) => {
    const { mnemonic_phrase, address } = params;
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
        const principal = identity.getPrincipal().toString();
        const address = ledger_icp_1.AccountIdentifier.fromPrincipal({ principal: principal_1.Principal.from(principal) }).toHex();
        const amount = await ICPCanister.accountBalance({ accountIdentifier: address });
        const balance = amount / FLOATING_POINT;
        return JSON.stringify({ balance: balance.toString(), "status": "success" });
    }
    catch (error) {
        console.log(error);
        return `Error: ${error.message}`;
    }
};
exports.getICPBalanceByAddress = getICPBalanceByAddress;
