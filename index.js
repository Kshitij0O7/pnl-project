const axios = require('axios');
require('dotenv').config()

let data;
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

const getWeightedAverage = async (token, wallet) => {
    let data = JSON.stringify({
        "query": "query MyQuery($token: String = \"\", $wallet: String = \"\") {\n  EVM(dataset: combined) {\n    DEXTrades(\n      where: {Trade: {Buy: {Currency: {SmartContract: {is: $token}}, PriceInUSD: {ne: 0}}}, Transaction: {From: {is: $wallet}}}\n    ) {\n      Trade {\n        Buy {\n          Amount\n          PriceInUSD\n        }\n      }\n    }\n  }\n}\n",
        "variables": `{\n  \"token\": \"${token}\",\n  \"wallet\": \"${wallet}\"\n}`
     });
     
    config.data = data;

    const response = await axios.request(config);
    const buyTrades = response.data.data.EVM.DEXTrades;
    
    let count = 0;
    let sum = 0;
    for( let i in buyTrades){
        let amount = parseFloat(buyTrades[i].Trade.Buy.Amount);
        let price = buyTrades[i].Trade.Buy.PriceInUSD;
        sum += amount*price;
        count += amount;
        // console.log(amount, price, "Product:", amount*price)
    }
    // console.log(sum, count)
    return sum/count;
}

const getPnL = async (token, wallet) => {
    let data = JSON.stringify({
        "query": "query MyQuery($token: String = \"\", $wallet: String = \"\") {\n  EVM(dataset: combined) {\n    DEXTrades(\n      where: {Trade: {Sell: {Currency: {SmartContract: {is: $token}}, PriceInUSD: {ne: 0}}}, Transaction: {From: {is: $wallet}}}\n      orderBy: {ascending: Block_Time}\n    ) {\n      Trade {\n        Sell {\n          Amount\n          PriceInUSD\n        }\n      }\n    }\n  }\n}\n",
        "variables": `{\n  \"token\": \"${token}\",\n  \"wallet\": \"${wallet}\"\n}`
     });
     
    const average = await getWeightedAverage(token, wallet);
    config.data = data;

    const response = await axios.request(config);
    // console.log(response.data.data);
    // console.log(average)
    const sellTrades = response.data.data.EVM.DEXTrades;
    let pnl = 0;

    for(let i in sellTrades){
        let amount = parseFloat(sellTrades[i].Trade.Sell.Amount);
        let sellPrice = sellTrades[i].Trade.Sell.PriceInUSD;
        // console.log(sellPrice-average);
        let difference = sellPrice-average
        let margin = amount*difference;
        // console.log(amount, margin, difference)
        pnl += margin;
    }
    // console.log(average);
    console.log(pnl);
}

getPnL("0x6982508145454ce325ddbe47a25d4ec3d2311933", "0x2107662b0eb1f95a42f47f667c6d4622fe1c9231");

// 0.000028572993474997303
// -34665585129.98317 USD