const contract = require('./trigon_interface/interface');
const fs = require('fs');
const moment = require('moment');
const { relativeTimeThreshold } = require('moment');

class ChartHandler {
    constructor() {
        this.time = 0;
        this.nextPrice = 0;
        this.lastMonthPrice = 0;
        this.sellCommission = 0;
        this.nextDate = new Date();
        this.lastMonth = new Date();
        this.chartPrices = [];
        this.dates = [];
    }

    addRecord(record) {
        this.records.push(record);
    }

    readPrices() {
        fs.readFile('./prices.json', 'utf-8', (err, data) => {
            if(err) return;
            if(data.length !== 0) {
                let newData = JSON.parse(data);
                this.chartPrices = newData.prices;
                this.dates = newData.dates;
                this.lastMonthPrice = newData.lastMonthPrice;
            }
        });
    }

    writePrices(newPrice, newDate) {
        let formatedDate = newDate;

        this.chartPrices = [...this.chartPrices, newPrice ];
        this.dates = [...this.dates, formatedDate]
        let writeData = {
            prices: this.chartPrices,
            dates: this.dates,
            lastMonthPrice: this.lastMonthPrice
        };

        fs.truncate('./prices.json', 0, function() {});
        fs.writeFile('./prices.json', JSON.stringify(writeData), () => {

        });
    }

    getSellCommission = async () => {
        await contract.methods.getCommissionCost().call().then(res => {
            this.sellCommission = res/100;
        });
    }

    getInitialPrice() {
        contract.methods.price().call().then(res => {
            this.getSellCommission().then(() => {
                this.nextPrice = (1 - this.sellCommission) * (res/10e17);
                this.nextDate = new Date();
    
                this.lastMonthPrice = (1 - this.sellCommission) * 0.001;
    
                // if(this.nextDate.getTime() - this.lastMonth.getTime() > 6.9063916e15) {
                //     this.lastMonthPrice = this.nextPrice;
                //     this.lastMonth = this.nextDate;
                // }
    
                this.writePrices(this.nextPrice, this.nextDate);
            });
        });
    }

    startPriceTimer() {

        const getPrice = async () => {
            await contract.methods.price().call().then(res => {
                this.getSellCommission().then(() => {
                    this.nextPrice = (1 - this.sellCommission) * (res/10e17);
                    this.nextDate = new Date();
        
                    this.lastMonthPrice = (1 - this.sellCommission) * 0.001;
        
                    // if(this.nextDate.getTime() - this.lastMonth.getTime() > 6.9063916e15) {
                    //     this.lastMonthPrice = this.nextPrice;
                    //     this.lastMonth = this.nextDate;
                    // }
        
                    this.writePrices(this.nextPrice, this.nextDate);
                });

            });
        }

        setInterval(getPrice, 10000);

    }

    updatePrice() {
        contract.events.Price().on('data', (event) => {
            console.log("Event happened:", event)

            contract.methods.price().call().then(res => {
                this.getSellCommission().then(() => {
                    this.nextPrice = (1 - this.sellCommission) * (res/10e17);
                    this.nextDate = new Date();
        
                    this.lastMonthPrice = (1 - this.sellCommission) * 0.001;
        
                    // if(this.nextDate.getTime() - this.lastMonth.getTime() > 6.9063916e15) {
                    //     this.lastMonthPrice = this.nextPrice;
                    //     this.lastMonth = this.nextDate;
                    // }
        
                    this.writePrices(this.nextPrice, this.nextDate);
                });
            });
        });
    }
}

module.exports.ChartHandler = new ChartHandler();