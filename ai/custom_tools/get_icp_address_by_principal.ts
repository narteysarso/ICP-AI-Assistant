import { Principal } from "@dfinity/principal";
import { identityFromSeed } from "../utils/helpers";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { AccountIdentifier }from "@dfinity/ledger-icp";


export const getICPAddressByPrincipal = async (params: { mnemonic_phrase: string , principal: string}) => {
    // Completely insecure seed phrase. Do not use for any purpose other than testing.
    const { mnemonic_phrase, principal} = params;
    const seed: string = (mnemonic_phrase.length > 12) ? mnemonic_phrase : process.env.TEST_PHRASE as string;

    try {
        const identity: Secp256k1KeyIdentity = await identityFromSeed(seed);
        const address: string = AccountIdentifier.fromPrincipal({ principal: Principal.from(principal) }).toHex();
        return JSON.stringify({ address, "status": "success" });
    } catch (error: any) {
        console.log(error);
        return `Error: ${error.message}`
    }

}