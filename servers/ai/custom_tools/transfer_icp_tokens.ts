import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp";
import { createAgent } from "@dfinity/utils";
import { identityFromSeed } from "../utils/helpers";
import { Principal } from "@dfinity/principal";
require('dotenv').config({ path: ".env" });

export const transferICPToken = async (params: { to: string, mnemonic_phrase: string, amount: string }) => {

	const { to, mnemonic_phrase, amount } = params;

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

		const amt = BigInt(amount) * FLOATING_POINT;

		await ICPCanister.transfer({
			to: AccountIdentifier.fromHex(to),
			amount: amt
		});

		return JSON.stringify({ "status": "success" });
	} catch (error: any) {
		console.log(error);
		return `Error: ${error.message}`
	}

}