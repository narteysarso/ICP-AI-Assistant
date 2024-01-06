import fetch from 'node-fetch';
require('dotenv').config({path: ".env"});
export const convertFromBaseToDesitinationCurrency = async (params: { from: string, to: string, amount: string }) => {
    const { from, to, amount } = params;
    const url = `https://currency-exchange.p.rapidapi.com/exchange?from=${from}&to=${to}&q=${amount}`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.X_RapidAPI_Key as string,
            'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
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
