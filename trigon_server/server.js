const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const ChartHandler = require('./chartHandler');
const fs = require('fs');
const priceAPI = require('./priceApi');

ChartHandler.ChartHandler.readPrices();

if(ChartHandler.ChartHandler.chartPrices.length === 0)
    ChartHandler.ChartHandler.getInitialPrice();

ChartHandler.ChartHandler.startPriceTimer();



app.use(express.static(path.resolve(__dirname, 'wallet')));

app.get('/api/chart', (req, res) => {
    fs.readFile('./prices.json', 'utf-8', (err, data) => {
        if(data.length !== 0) {
            let newData = JSON.parse(data);
            res.json(newData);
        }
    });
});

app.get('/api/getPrices', async (req, res) => {
    let prices = await priceAPI.getPrices(ChartHandler.ChartHandler.lastMonthPrice);
    res.json(prices);
});


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'wallet', 'index.html'));
})

app.listen(port, () => {
    console.log('Listening on port', port);
})