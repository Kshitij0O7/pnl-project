# PnL Calculator

In this project we will calculate the realised pnl that is profit or loss already made. For this project we are using the approach involving Weighted Average. This program contains two functions.

## Function to Calculate Weighted Average of Buy Price
`getWeightedAverage()` function returns the weighted average of the buy price(WABP) for the mentioned wallet and token address using the following formula.

WABP(amount, buyPriceInUSD) = &sum;amount<sub>i</sub> * buyPriceInUSD<sub>i</sub> (for i in the returned buy Trades)

## Function to Calculate PnL for the Wallet
`getPnL` function returns the PnL for the specified wallet involving the trades where the mentioned token is sold using the formula given.

PnL(amountSold, sellPriceInUSD) = &sum;amount<sub>i</sub> * (sellPriceInUSD<sub>i</sub> - WABP)

## Instructions to Use

- Clone the repository using the command and enter the project.
``` cmd
git clone https://github.com/Kshitij0O7/pnl-project
cd pnl-project
```

- Install the dependencies using the command.
``` cmd
npm install
```

- Create a `.env` file and add the variable called `AUTH_TOKEN` there. Get this access token from [here](https://account.bitquery.io/user/api_v2/access_tokens). 

- On the last line of `index.js` file where the `getPnL` function is called replace the entered fields with `token address` and `wallet address` in the mentioned order.

- Now run the script by entering the following command.

``` cmd
node index.js
```