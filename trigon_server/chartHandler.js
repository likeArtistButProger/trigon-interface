const contract = require('./trigon_interface/interface');
const fs = require('fs');

class ChartHandler {
    constructor() {
        this.time = 0;
        this.nextPrice = 0;
        this.lastMonthPrice = 0;
        this.nextDate = new Date();
        this.lastMonth = new Date();
        this.chartPrices = [];
    }

    addRecord(record) {
        this.records.push(record);
    }

    readPrices() {
        fs.readFile('./prices.json', 'utf-8', (err, data) => {
            if(err) console.log(err);
            let newData = JSON.parse(data);
            this.chartPrices = newData.prices;
            this.lastMonthPrice = newData.lastMonthPrice;
        });
    }

    writePrices(newPrice, newDate) {
        this.chartPrices = [...this.chartPrices, {price: newPrice, date: newDate }];
        let writeData = {
            prices: this.chartPrices,
            lastMonthPrice: this.lastMonthPrice
        }
        fs.truncate('./prices.json', 0, function() {});
        fs.writeFile('./prices.json', JSON.stringify(writeData), () => {

        });
    }

    startPriceTimer() {
        const getPrice = () => {
            contract.methods.price().call().then(res => {
                this.nextPrice = res/10e18;
                this.nextDate = new Date();

                if(this.nextDate.getTime() - this.lastMonth.getTime() > 6.9063916e15) { 
                    this.lastMonthPrice = this.nextPrice;
                    this.lastMonth = this.nextDate;
                }

                this.writePrices(res/10e18, this.nextDate);
            });
            
        }

        setInterval(getPrice, 15000); //2.628e6
    }
}

module.exports.ChartHandler = new ChartHandler();