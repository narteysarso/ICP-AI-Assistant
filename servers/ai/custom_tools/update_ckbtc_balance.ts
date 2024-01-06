import { identityFromSeed } from "../utils/helpers";
import { CkBTCMinterCanister, } from "@dfinity/ckbtc";
import { Principal } from "@dfinity/principal";
import { createAgent } from "@dfinity/utils";
require('dotenv').config({path: ".env"});


export const updateCKBTCBalance = async (params: {mnemonic_phrase: string}) => {
    const {mnemonic_phrase} = params;
    const CKBTC_MINTER_CANISTER_ID = process.env.CKBTC_MINTER_CANISTER_ID as string;
    const HOST = process.env.CANSITER_NETWORK_HOST as string;


    try {
        const identity = await identityFromSeed(mnemonic_phrase);
        const agent = await createAgent({
            host: HOST,
            identity,
            fetchRootKey: true,
            verifyQuerySignatures: false,
        });

        const ckbtcMinterCanister = CkBTCMinterCanister.create({
            agent,
            canisterId: Principal.from(CKBTC_MINTER_CANISTER_ID),
        });

        await ckbtcMinterCanister.updateBalance({});


        return JSON.stringify({ "status": "success" });

    } catch (error: any) {
        console.log(error);
        return `Error: ${error.message}`
    }

}