import fetch from 'node-fetch';
require('dotenv').config({path: ".env"});
export const getListOfLatestTokens = async (params: { limit: string }) => {
    const { limit } = params;

    const infoUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
    const url = limit ? `${infoUrl}?limit=${limit}` : infoUrl;

    const options = {
        method: 'GET',
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string,
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        return result;
    } catch (error) {
        console.error(error);
        return '';
    }
}