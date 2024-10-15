const axios = require('axios');
require('dotenv').config()
let data = JSON.stringify({
   "query": "query MyQuery($token: String = \"\", $wallet: String = \"\") {\n  EVM(dataset: combined) {\n    DEXTrades(\n      where: {Trade: {Buy: {Currency: {SmartContract: {is: $token}}, PriceInUSD: {ne: 0}}}, Transaction: {From: {is: $wallet}}}\n    ) {\n      Trade {\n        Buy {\n          Amount\n          PriceInUSD\n        }\n      }\n    }\n  }\n}\n",
   "variables": `{\n  \"token\": \"0x6982508145454ce325ddbe47a25d4ec3d2311933\",\n  \"wallet\": \"0xae2fc483527b8ef99eb5d9b44875f005ba1fae13\"\n}`
});

let config = {
   method: 'post',
   maxBodyLength: Infinity,
   url: 'https://streaming.bitquery.io/graphql',
   headers: { 
      'Content-Type': 'application/json', 
      'X-API-KEY': 'BQYuTITWanwYGz0YLGdcWSADO74o5RTX', 
      'Authorization': process.env.AUT_TOKEN
   },
   data : data
};

const getWeightedAverage = async () => {
    const response = await axios.request(config);
    const buyTrades = response.data.data.EVM.DEXTrades;
    
    let count = 0;
    let sum = 0;
    for( let i in buyTrades){
        let amount = parseFloat(buyTrades[i].Trade.Buy.Amount);
        let price = parseFloat(buyTrades[i].Trade.Buy.PriceInUSD);
        sum += amount*price;
        count += 1;
    }
    console.log(sum/count);
}

getWeightedAverage();