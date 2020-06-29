const CoinGecko = require('coingecko-api');
const axios = require('axios');

const CoinGeckoClient = new CoinGecko(CoinGecko.ORDER.COIN_NAME_ASC);

const CoinGeckoAPIEndPoint = 'https://api.coingecko.com/api/v3/simple/price';
/* CoinGecko doesn't return prices for snx, lend and susd 
    comp:'compound'
*/
const tokenIds = {
                    bat:'basic-attention-token', busd:'binance-usd', comp:'compound', dai:'dai', 
                    eth:'ethereum', knc:'kyber-network', link:'chainlink',
                    mana:'decentraland', mkr:'maker', rep:'augur', tusd:'true-usd', 
                    usdc:'usd-coin', usdt:'tether', wbtc:'wrapped-bitcoin', zrx:'0x',
                    lend:'aave', snx:'synthetix-network-token', susd:'susd'
                   };

async function getPriceInEth(token) {
    try {
        if(token==='eth') return 1;
        const ethResponse  = await axios.get(`${CoinGeckoAPIEndPoint}?ids=ethereum&vs_currencies=usd`);
        const ethInUSD =ethResponse.data.ethereum.usd;
        const tokenResponse = await axios.get(`${CoinGeckoAPIEndPoint}?ids=${tokenIds[token]}&vs_currencies=usd`);
        const tokenInUSD = tokenResponse.data[tokenIds[token]].usd;
        const tokenInEth = tokenInUSD/ethInUSD;
        if(!tokenInEth) return -1;
        return tokenInEth;
    }
    catch(err) {
        console.log(tokenIds[token]);
        console.log(err);
        return -1;
    }
}

export { getPriceInEth };