import { getRandomPhrase } from "./get_random_phrase";
import {getIdentity} from "./get_identity";
import {getCryptocurrencyTokenInfo} from "./get_info_about_cryptocurrency_token"
import { getCurrencyList } from "./get_currency_list";
import { getListOfLatestTokens } from "./get_list_of_latest_tokens";
import { convertFromBaseToDesitinationCurrency } from "./convert_from_base_to_destination_currency";
import { getCKBTCAddress } from "./get_ckbtc_address";
import { getCKBTCBalance } from "./get_ckbtc_balance";
import { updateCKBTCBalance } from "./update_ckbtc_balance";
import { getCryptoBlockchainNews } from "./get_crypto_blockchain_news";
import { getICPAddressByPrincipal } from "./get_icp_address_by_principal";
import { getICPBalanceByAddress } from "./get_icp_balance_by_address";
import { transferCKBTC } from "./transfer_ckbtc";
import { transferICPToken } from "./transfer_icp_tokens";
import { search } from "./search";

const funcMap: any = Object.freeze({
    "get_random_phrase":getRandomPhrase,
    "get_ICP_identity":getIdentity,
    "get_info_about_cryptocurrency_token" : getCryptocurrencyTokenInfo,
    "get_currency_list": getCurrencyList,
    "get_list_of_latest_tokens": getListOfLatestTokens,
    "convert_from_base_to_destination_currency": convertFromBaseToDesitinationCurrency,
    "get_ckbtc_address_by_principal": getCKBTCAddress,
    "get_ckbtc_balance_by_principal": getCKBTCBalance,
    "update_ckbtc_balance": updateCKBTCBalance,
    "get_crypto_blockchain_news": getCryptoBlockchainNews,
    "get_icp_address_by_principal": getICPAddressByPrincipal,
    "get_icp_balance_by_address": getICPBalanceByAddress,
    "transfer_CKBTC_TOKEN": transferCKBTC,
    "transfer_ICP_token" : transferICPToken,
    "search": search

});

export const func_call = async (func: string, params: Object) =>{
    const fc = funcMap[func];
    if(!fc) throw Error("Invalid function call");

    return await fc(params);
}