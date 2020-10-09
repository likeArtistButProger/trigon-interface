const contract = require('./trigon_interface/interface');
const axios = require('axios');

async function getBuyCommission() {
    const admin_commission = await contract.methods.getCommissionAdmin().call().then(res => res);
    const ref_commission = await contract.methods.getCommissionRef().call().then(res => res);
    const growth_commission = await contract.methods.getCommissionCost().call().then(res => res);

    return {
        growth_commission: parseFloat(growth_commission)/100, 
        admin_commission: parseFloat(admin_commission)/100,
        ref_commission: parseFloat(ref_commission)/100
    }
}

async function getSellComission() {
    const commission = await contract.methods.getCommissionCost().call().then(res => res)

    return parseFloat(commission)/100
}

async function getEtheriumPrice() {
    const USD = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD').then(res => res.data.USD);

    return USD;
}

async function getPrice() {
    const base_price = await contract.methods.price().call().then(res => res/10e17);

    return base_price;
}

module.exports.getPrices = async function getPrices(start_price) {

    // For tokens
    const BuyCommission = await getBuyCommission().then(res => res);
    const {admin_commission, ref_commission, growth_commission} = BuyCommission;
    const sellCommission  = await getSellComission();
    const basePrice = await getPrice().then(res => res);

    const buyPrice = (basePrice * (1 + ref_commission + growth_commission)) / (1 - growth_commission);
    const sellPrice = (1 - sellCommission) * basePrice;

    // For ethereum in USD
    const ethPriceInUSD = await getEtheriumPrice().then(res => res);

    const tokenPriceInUSD = buyPrice * ethPriceInUSD;

    start_price = parseFloat(start_price);

    let lastSell = (1 - sellCommission) * start_price;
    let lastBuy = (start_price * (1 + admin_commission + ref_commission)) / (1 - growth_commission);

    let diffSell = sellPrice - lastSell;
    let diffBuy = buyPrice - lastBuy;

    let sellPercent = diffSell / lastSell;
    let buyPercent = diffBuy / lastBuy;

    if(sellPercent === Infinity || sellPercent === undefined) {
        sellPercent = 0;
    }

    if(buyPercent === Infinity || buyPercent === undefined) {
        buyPercent = 0;
    }

    sellPercent *= 100;
    buyPercent *= 100;

    return {
        sellPercent: parseInt(sellPercent),
        buyPercent: parseInt(buyPercent),
        priceUSD: parseFloat(tokenPriceInUSD.toFixed(2)),
        priceETH: parseFloat(buyPrice.toFixed(4))
    };
}