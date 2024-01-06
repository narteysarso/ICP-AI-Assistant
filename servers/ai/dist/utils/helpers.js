"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identityFromSeed = void 0;
const identity_secp256k1_1 = require("@dfinity/identity-secp256k1");
const hdkey = require('hdkey');
const bip39 = require('bip39');
const identityFromSeed = async (phrase) => {
    const seed = await bip39.mnemonicToSeed(phrase);
    const root = hdkey.fromMasterSeed(seed);
    const addrnode = root.derive("m/44'/223'/0'/0/0");
    return identity_secp256k1_1.Secp256k1KeyIdentity.fromSecretKey(addrnode.privateKey);
};
exports.identityFromSeed = identityFromSeed;
