import fetch from 'node-fetch';
require('dotenv').config({path: ".env"})
export const getCryptocurrencyTokenInfo = async (parmas: { symbol?: string, slug?: string }) => {
    const { symbol, slug } = parmas;
    const infoUrl = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/info"
    const url = symbol ? `${infoUrl}?symbol=${symbol}` : `${infoUrl}?slug=${slug}`;

    const options = {
        method: 'GET',
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string,
        }
    }
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        return result;
    } catch (error) {
        console.error(error);
        return '';
    }
}