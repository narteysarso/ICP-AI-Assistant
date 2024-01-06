import { identityFromSeed } from "../utils/helpers";
import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp";
import { createAgent } from "@dfinity/utils";
import { Principal } from "@dfinity/principal";

require('dotenv').config({ path: ".env" });


export const getICPBalanceByAddress = async (params: {mnemonic_phrase: string, address: string}) => {

    const {mnemonic_phrase, address} = params;
  

    const FLOATING_POINT = 100000000n
    const CANISTER_ID = process.env.ICP_LEDGER_CANISTER_ID as string;

	const HOST = process.env.CANSITER_NETWORK_HOST as string;

  
    try {
        const identity = await identityFromSeed(mnemonic_phrase);
        const agent = await createAgent({
            host: HOST,
            identity,
            fetchRootKey: true,
            verifyQuerySignatures: false,
        });

        const ICPCanister = LedgerCanister.create({
            agent,
            canisterId: Principal.from(CANISTER_ID),
        });

        const principal = identity.getPrincipal().toString();
        const address = AccountIdentifier.fromPrincipal({ principal: Principal.from(principal) }).toHex()

        const amount = await ICPCanister.accountBalance({ accountIdentifier: address })
        const balance = amount / FLOATING_POINT;

        return JSON.stringify({ balance: balance.toString(), "status": "success" });

    } catch (error: any) {
        console.log(error);
        return `Error: ${error.message}`
    }
}