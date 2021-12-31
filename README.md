# RandomEarth NFT sniper

This project aims to make it easier to find potential bargains on the RandomEarth market.

# How to run

Due to the strict policy of RandomEarth, I'm unable to use their API. Therefore one need to scrape their website to obtain market data. If you want to use it, you need to host it locally. It might be handy to run a VPN alongside.

## Setup dependencies
Run `yarn install` to install dependencies.

## Run application
Run `yarn app` to host frontend application within a newly opened browser.

## How to use

Create a new sniper:

1. Provide a RandomEarth link that defines your requirements, for example: `https://randomearth.io/collections/terra103z9cnqm8psy0nyxqtugg6m7xnwvlkqdzm4s4k?sort=price.asc&glasses_=cool%20punk`
2. Define a condition as a piece of js code. When it evaluates to `TRUE`, a notification from a given sniper is being sent.
3. Press the "Update prices" button to fetch the current floor price for a defined sniper.
