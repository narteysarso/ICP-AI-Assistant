import { CkBTCMinterCanister, } from "@dfinity/ckbtc";
import { Principal } from "@dfinity/principal";
import { createAgent } from "@dfinity/utils";
import { identityFromSeed } from "../utils/helpers";
require('dotenv').config({path: ".env"});

export const getCKBTCAddress = async (params: { principal: string, mnemonic_phrase: string }) => {
	const { principal, mnemonic_phrase } = params;

	const CKBTC_MINTER_CANISTER_ID = process.env.CKBTC_MINTER_CANISTER_ID as string;
	const HOST = process.env.CANSITER_NETWORK_HOST;

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

		const address = await ckbtcMinterCanister.getBtcAddress({ owner: Principal.from(principal) });


		return JSON.stringify({ address, "status": "success" });


	} catch (error: any) {
		console.log(error);
		return `Error: ${error.message}`
	}
}