import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { createAgent } from "@dfinity/utils";
import { identityFromSeed } from "../utils/helpers";
import { Principal } from "@dfinity/principal";
require('dotenv').config({ path: ".env" });

export const transferCKBTC = async (params: { recipient_principal: string, mnemonic_phrase: string, amount: string }) => {
  const { recipient_principal, mnemonic_phrase, amount } = params
  const FLOATING_POINT = 100000000n
  const CKBTC_LEDGER_CANISTER_ID = process.env.CKBTC_LEDGER_CANISTER_ID as string;

  // const HOST = 'https://8a58-154-160-23-193.ngrok-free.app/';
  const HOST = 'http://localhost:8000/';
  const amt = BigInt("1") * FLOATING_POINT;

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
    const amountE8s = BigInt(amount) * FLOATING_POINT;
    await ckbtcLedgerCanister.transfer({ to: { owner: Principal.from(recipient_principal), subaccount: [] }, amount: amountE8s })

    return JSON.stringify({ "status": "success" });

  } catch (error: any) {
    console.log(error);
    return `Error: ${error.message}`
  }

}