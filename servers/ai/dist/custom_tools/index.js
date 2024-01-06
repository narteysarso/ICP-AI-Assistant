"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.func_call = void 0;
const get_random_phrase_1 = require("./get_random_phrase");
const get_identity_1 = require("./get_identity");
const get_info_about_cryptocurrency_token_1 = require("./get_info_about_cryptocurrency_token");
const get_currency_list_1 = require("./get_currency_list");
const get_list_of_latest_tokens_1 = require("./get_list_of_latest_tokens");
const convert_from_base_to_destination_currency_1 = require("./convert_from_base_to_destination_currency");
const get_ckbtc_address_1 = require("./get_ckbtc_address");
const get_ckbtc_balance_1 = require("./get_ckbtc_balance");
const update_ckbtc_balance_1 = require("./update_ckbtc_balance");
const get_crypto_blockchain_news_1 = require("./get_crypto_blockchain_news");
const get_icp_address_by_principal_1 = require("./get_icp_address_by_principal");
const get_icp_balance_by_address_1 = require("./get_icp_balance_by_address");
const transfer_ckbtc_1 = require("./transfer_ckbtc");
const transfer_icp_tokens_1 = require("./transfer_icp_tokens");
const search_1 = require("./search");
const funcMap = Object.freeze({
    "get_random_phrase": get_random_phrase_1.getRandomPhrase,
    "get_ICP_identity": get_identity_1.getIdentity,
    "get_info_about_cryptocurrency_token": get_info_about_cryptocurrency_token_1.getCryptocurrencyTokenInfo,
    "get_currency_list": get_currency_list_1.getCurrencyList,
    "get_list_of_latest_tokens": get_list_of_latest_tokens_1.getListOfLatestTokens,
    "convert_from_base_to_destination_currency": convert_from_base_to_destination_currency_1.convertFromBaseToDesitinationCurrency,
    "get_ckbtc_address_by_principal": get_ckbtc_address_1.getCKBTCAddress,
    "get_ckbtc_balance_by_principal": get_ckbtc_balance_1.getCKBTCBalance,
    "update_ckbtc_balance": update_ckbtc_balance_1.updateCKBTCBalance,
    "get_crypto_blockchain_news": get_crypto_blockchain_news_1.getCryptoBlockchainNews,
    "get_icp_address_by_principal": get_icp_address_by_principal_1.getICPAddressByPrincipal,
    "get_icp_balance_by_address": get_icp_balance_by_address_1.getICPBalanceByAddress,
    "transfer_CKBTC_TOKEN": transfer_ckbtc_1.transferCKBTC,
    "transfer_ICP_token": transfer_icp_tokens_1.transferICPToken,
    "search": search_1.search
});
const func_call = async (func, params) => {
    const fc = funcMap[func];
    if (!fc)
        throw Error("Invalid function call");
    return await fc(params);
};
exports.func_call = func_call;
