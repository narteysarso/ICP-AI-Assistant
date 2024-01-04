import { identityFromSeed } from "../utils/helpers";

export async function getIdentity(params: { mnemonic_phrase: string }) {
    const { mnemonic_phrase } = params;
    // Completely insecure seed phrase. Do not use for any purpose other than testing.
    const seed = (mnemonic_phrase.length > 12) ? mnemonic_phrase : 'test test test test test test test test test test test test';

    try {
        const identity = await identityFromSeed(seed);
        return JSON.stringify({
            "seed": seed,
            "principal": identity?.getPrincipal()?.toString() || "",
            "identity": identity
        });

    } catch (error: any) {
        console.log(error);
        return `Error: ${error.message}`;
    }

}
