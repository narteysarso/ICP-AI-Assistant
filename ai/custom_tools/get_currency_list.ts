import fetch from 'node-fetch';
require('dotenv').config({path: ".env"})
export const getCurrencyList = async () => {
    const url = 'https://currency-exchange.p.rapidapi.com/listquotes';

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.X_RapidAPI_Key as string,
            'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
        }
    };

    console.log(options);

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        return result;
    } catch (error) {
        console.error(error);
        return '';
    }

}