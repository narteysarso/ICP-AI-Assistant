import crypto from 'crypto';
const bip39 = require("bip39");

export const getRandomPhrase = ()=> {
    try {
        // author: https://github.com/jprichardson
        const randomBytes = crypto.randomBytes(32);
        const mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex')) as string
        return mnemonic;

    } catch (error: any) {
        console.log(error);
        return `Error: ${error.message}`
    }

}