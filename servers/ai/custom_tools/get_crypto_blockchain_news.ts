import fetch from 'node-fetch';
require('dotenv').config({ path: ".env" });

export const getCryptoBlockchainNews = async () => {
    const url = 'https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk';

    const options = {
        method: 'GET',
        url: 'https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk',
        headers: {
            'X-RapidAPI-Key': process.env.X_RapidAPI_Key as string,
            'X-RapidAPI-Host': 'cryptocurrency-news2.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const text = await response.text();

        return text;
    } catch (error) {
        console.error(error);
        return '';
    }


}