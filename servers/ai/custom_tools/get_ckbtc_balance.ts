import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { createAgent } from "@dfinity/utils";
import { identityFromSeed } from "../utils/helpers";
import { Principal } from "@dfinity/principal";
require('dotenv').config({path: ".env"});

export const getCKBTCBalance = async (params: { principal: string, mnemonic_phrase: string }) => {

  const { principal, mnemonic_phrase } = params;
  const HOST = process.env.CANSITER_NETWORK_HOST;
  const FLOATING_POINT = 100000000n
  const CKBTC_LEDGER_CANISTER_ID = process.env.CKBTC_LEDGER_CANISTER_ID as string;

  try {
    const identity = await identityFromSeed(mnemonic_phrase);
    const agent = await createAgent({
      host: HOST,
      identity,
      fetchRootKey: true,
      verifyQuerySignatures: false,
    });

    const ckbtcLedgerCanister = IcrcLedgerCanister.create({
      agent,
      canisterId: Principal.from(CKBTC_LEDGER_CANISTER_ID),
    });

    const amount = await ckbtcLedgerCanister.balance({owner: Principal.from(principal)});
    const balance = amount / FLOATING_POINT;
    console.log( balance);
    return JSON.stringify({balance: balance.toString(), "status": "success" });

  } catch (error: any) {
    console.log(error);
    return `Error: ${error.message}`
  }
}