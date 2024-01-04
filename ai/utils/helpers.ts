import { Secp256k1KeyIdentity, } from '@dfinity/identity-secp256k1';
const hdkey = require('hdkey');
const bip39 = require('bip39');

export const identityFromSeed = async (phrase: string) => {
    const seed = await bip39.mnemonicToSeed(phrase);
    const root = hdkey.fromMasterSeed(seed);
    const addrnode = root.derive("m/44'/223'/0'/0/0");

    return Secp256k1KeyIdentity.fromSecretKey(addrnode.privateKey);
};