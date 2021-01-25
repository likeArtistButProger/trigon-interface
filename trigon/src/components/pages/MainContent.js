import React, {Component} from 'react';
import TopBar from '../common/TopBar';
import axios from 'axios';

import '../../styles/maincontent.css';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { contract, methods } from '../../trigon_interface/interface';

import '../../styles/chart.css';

class MainContent extends Component {
    constructor(props) {
        super(props);

        this.w3 = window.web3;
        this.ethereum = window.ethereum;

        this.state = {
            chart_data: [],
            chart_dates: [],
            chart_options: {},
            chart_width: 0,
            chart_height: window.innerWidth >= 767 ? 600 : 300,
            lastMonthPrice: 0,
            account_eth_balance: 0,
            trigon_balance: 0,
            totalSupply: 0,
            totalEthSupply: 0,
            basePrice: 0,
            buyPrice: 0,
            sellPrice: 0,
            usd_price: 0,
            growth_commission: 0,
            admin_commission: 0,
            ref_commission: 0,
            sellCommission: 0,
            sellPercent: 0,
            buyPercent: 0,
            transactions: []
        }
    }

    getChartData = async () => {
        await axios.get('/wallet/api/chart').then(res => {
            const chartPrices = res.data.prices;
            const chartDates = res.data.dates;

            let chart_data = [];

            for(let i = 0; i < chartPrices.length; i++) {
                let itemDate = new Date(chartDates[i]).getTime(); //moment(chartDates[i]).format("MM:HH DD.MM.YYYY");
                let itemPrice = parseFloat(chartPrices[i].toFixed(10));
                chart_data.push([itemDate, itemPrice]);
            }

            this.setState({
                chart_data: chart_data,
                lastMonthPrice: res.data.lastMonthPrice 
            });

            return 0;
        })
    }

    updateSize = () => {
        this.setState({
            chart_width: this.chartRect.getBoundingClientRect().width,
            chart_height: window.innerWidth >= 767 ? 600 : 300
        })
    }

    getBalance = async () => {
        if(this.ethereum) {
            if(this.ethereum.selectedAddress !== null) {
                let address = this.ethereum.selectedAddress;
                let eth_balance;
                const balance = await this.w3.eth.getBalance(address, (error, balance) => {
                    eth_balance = this.w3.utils.fromWei(balance, "ether") + "";
                    eth_balance = parseFloat(eth_balance).toFixed(4);
                    this.setState({
                        account_eth_balance: eth_balance
                    })
                });
            }
        }
    }

    getTrigonBalance = async () => {
        if(this.ethereum) {
            let address = this.ethereum.selectedAddress;

            if(address) {
                await methods.balanceOf(address).call().then(res => {
                        this.setState({
                            trigon_balance: (res/10e17).toFixed(3)
                        })
                    }  
                );
               
            }
        }
    }

    getTotalSupply = async () => {
        await methods.totalSupply().call().then(res => {
            this.setState({
                totalSupply: (res/10e17).toFixed(3)
            })
        })
    }

    getTotalEthSupply = async () => {
        await methods.bank().call().then(res => {
            this.setState({
                totalEthSupply: (res/10e17).toFixed(3)
            })
        });
    }

    getBuyCommission = async () => {
        const admin_commission = await methods.getCommissionAdmin().call().then(res => res);
        const ref_commission = await methods.getCommissionRef().call().then(res => res);
        const growth_commission = await methods.getCommissionCost().call().then(res => res);

        await methods.getCommission().call().then(res => {
            this.setState({
                growth_commission: parseFloat(growth_commission)/100, 
                admin_commission: parseFloat(admin_commission)/100,
                ref_commission: parseFloat(ref_commission)/100
            })
        })
    }

    getSellComission = async () => {
        await methods.getCommissionCost().call().then(res => {
            this.setState({
                sellCommission: parseFloat(res)/100
            })
        })
    }

    getEtheriumPrice = () => {
        axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD').then(res => {
            this.setState({
                usd_price: res.data.USD
            })
        })
    }

    getPrice = async () => {
        await methods.price().call().then(res => {
            let basePrice = res/10e17;
            let adm_com = this.state.admin_commission;
            let ref_com = this.state.ref_commission;
            this.setState({
                basePrice: basePrice,
                buyPrice: ((basePrice*(1+adm_com+ref_com))/(1 - this.state.growth_commission)),
                sellPrice: ((1 - this.state.sellCommission) * basePrice)
            });
        });
    }

    toFixed = (num, fixed) => {
        var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
    }

    updatePercents = () => {
        let { lastMonthPrice, buyPrice, sellPrice, ref_commission, admin_commission, growth_commission, sellCommission }  = this.state;
        
        lastMonthPrice = parseFloat(lastMonthPrice);

        buyPrice = buyPrice;
        sellPrice = sellPrice;

        let lastSell = (1 - sellCommission) * lastMonthPrice;
        let lastBuy = (lastMonthPrice * (1 + admin_commission + ref_commission)) / (1 - growth_commission);

        lastSell = lastSell;
        lastBuy = lastBuy;

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

        this.setState({
            sellPercent: parseInt(sellPercent),
            buyPercent: parseInt(buyPercent)
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateSize);

        this.setState({
            chart_width: this.chartRect.getBoundingClientRect().width
        });

        this.getBalance();
        this.getTrigonBalance();
        this.getTotalSupply();
        this.getTotalEthSupply();
        this.getEtheriumPrice();
        this.getBuyCommission()
        .then(async () => {
            await this.getSellComission()
        })
        .then(async () => {
            await this.getPrice()
        })
        .then(async () => {
            await this.getChartData();
        }).then(async () => {
            await this.updatePercents();
        });


        if(this.ethereum) {
            this.w3.setProvider(this.ethereum);

            this.ethereum.on('accountsChanged', (accounts) => {
                this.getTrigonBalance();
                this.getBalance();
            })
        }

        contract.events.Price().on('data', async (event) => {

            await this.getBuyCommission()
            .then(async () => {
                await this.getSellComission()
            })
            .then(async () => {
                let basePrice =  parseFloat(event.returnValues.value)/10e17;
                let totalSupply = (parseFloat(event.returnValues.totalSupply)/10e17).toFixed(3);
    
                let { admin_commission, ref_commission, growth_commission } = this.state;

                let buyPrice = (basePrice * (1 + admin_commission + ref_commission))/(1 - growth_commission);
                let sellPrice = (1 - this.state.sellCommission) * basePrice;

                this.setState({
                    basePrice: basePrice,
                    buyPrice: buyPrice,
                    sellPrice: sellPrice,
                    totalSupply: totalSupply
                });
    
                await this.getBalance();
                await this.getTrigonBalance();
                await this.getEtheriumPrice();
                await this.getTotalEthSupply();
                await this.updatePercents();
                      this.getChartData();
            });
        })
        .on('error', console.error);

        contract.events.Transfer().on('data', async (event) => {
            this.getTrigonBalance();
            this.getTransactionsHistory();
        }).on('error', (error) => {
            console.log(error);
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSize);
    }

    render () {

        return (
            <div className="flex flex-col w-11/12 mx-auto xl:mx-0 xl:ml-1">
                <div className="flex flex-row justify-between md:w-11/12 md:mx-auto text-left mt-3 text-xl">
                    <h1 className="mt-4">Dashboard</h1>
                    {
                        window.innerWidth >= 768 ? <div className="flex justify-between w-3/12 mt-4 bg-trigon_gray-300 rounded-md pt-2 px-2 text-sm mx-auto"><span>Balance:</span> {this.state.account_eth_balance} ETH</div> : null
                    }
                    {
                        window.innerWidth < 768 ? <div className="mt-4">{this.state.account_eth_balance} ETH</div> : <TopBar />
                    }
                </div>
                <div style={{width: "35.5%"}} className="hidden md:flex justify-between mt-8 ml-16">
                    <div className="text-xl">My wallet</div>
                    <div className="text-trigon_gray-300 mt-2">Overview</div>
                </div>
                <div className="mt-3 grid grid-cols-1 md:w-11/12 md:gap-2 md:mx-auto md:grid-cols-3 gap-5">
                    <div className="flex flex-col justify-between pb-3 bg-trigon_gray-300 md:row-start-1 md:row-end-3 rounded-md">
                        <div className="flex flex-col md:flex-col mt-3 ml-4">
                            <label style={{whiteSpace: "nowrap"}} className="text-md md:my-0 text-trigon_gray-100">Current balance</label>
                            <p id="balance" className="relative ml-auto mr-8 w-11/12 mx-auto text-center md:mb-0 md:mt-3 text-4xl md:text-4xl lg:text-5xl xl:text-6xl">{this.state.trigon_balance}</p>
                        </div>
                        <div className="flex flex-row pr-16 md:pl-0 md:pr-4 lg:pr-8 xl:pr-12 w-3/4 justify-between mx-auto my-auto">
                                <p style={{whiteSpace: 'nowrap'}} id="usd_balance" className="relative text-sm md:text-md lg:text-lg">~ {(this.state.trigon_balance*this.state.sellPrice*this.state.usd_price).toFixed(3)}</p>
                                <p id="eth_balance" className="relative text-sm md:text-md lg:text-lg">~ {(this.state.trigon_balance*this.state.sellPrice).toFixed(3)}</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between pb-3 bg-trigon_green rounded-md">
                        <div className="flex flex-col justify-between">
                            <div className="flex flex-row justify-between my-3 md">
                                <span style={{color: "#65A028"}} className="ml-3 my-auto md:text-sm lg:text-lg font-bold">
                                    Total TRGN Supply
                                </span>
                                <div style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}} className="w-10 h-10 mr-3 rounded-md">
                                    <img src='trigon_coin.png' alt="Trigon"/>
                                </div>
                            </div>
                            <div className="flex flex-row md:mt-8 lg:mt-0">
                                <p className="ml-3 text-lg mt-auto mb-2 font-normal">TRGN</p>
                                <p className="ml-auto mr-3 text-4xl md:text-2xl lg:text-4xl">{this.state.totalSupply}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between pb-3 bg-trigon_green rounded-md">
                        <div className="flex flex-col justify-between">
                            <div className="flex flex-row justify-between my-3">
                                <span style={{color: "#65A028"}} className="ml-3 my-auto md:text-sm lg:text-lg font-bold">
                                    Total ETH Balance
                                </span>
                                <div style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}} className="w-10 h-10 mr-3 rounded-md">
                                    <svg className="h-full mx-auto my-auto" width="16" height="25" viewBox="0 0 16 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M1.11581 11.3345L8.48422 8.32113L15.6259 11.4115L8.47289 0.46875L1.11581 11.3345ZM1.13849 14.6778L8.49556 18.813L16 14.6778L8.56358 24.7188L1.13849 14.6778ZM15.9773 13.0172L8.51823 9.79483L0.84375 12.9292L8.51823 17.0643L15.9773 13.0172Z" fill="white"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-row md:mt-8 lg:mt-auto">
                                <p className="ml-3 text-sm lg:text-xl mt-auto mb-2 font-normal">ETH</p>
                                <p className="ml-auto mr-3 text-4xl md:text-2xl lg:text-4xl">{this.state.totalEthSupply}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between pb-3 bg-trigon_gray-300 rounded-md row-start-3 md:row-start-2 md:col-start-2">
                        <div className="flex flex-row justify-between">
                            <span style={{whiteSpace: 'nowrap'}}  className="mt-4 my-auto ml-4 flex flex-row text-xs">{this.state.buyPrice.toFixed(10)} ETH <p style={{marginLeft: window.innerWidth >= 768 && window.innerWidth <= 790 ? '2px' : ''}} className="text-trigon_green text-xs my-auto ml-2">+{this.state.buyPercent}%</p></span>
                            <span onClick={() => {window.location.pathname = '/wallet/buy'}} className="text-sm mr-5 mt-3 md:mr-2 xl:mr-5 px-2 py-1 border-2 border-trigon_green rounded-full hover:text-trigon_green cursor-pointer">buy</span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between pb-3 bg-trigon_gray-300 rounded-md md:row-start-2 md:col-start-3">
                        <div className="flex flex-row justify-between">
                            <span style={{whiteSpace: 'nowrap'}} className="mt-4 my-auto ml-4 flex flex-row text-xs sm:text-md">{this.state.sellPrice.toFixed(10)} ETH <p style={{marginLeft: window.innerWidth >= 768 && window.innerWidth <= 790 ? '2px' : ''}} className="text-trigon_green text-xs my-auto ml-2">+{this.state.sellPercent}%</p></span>
                            <span onClick={() => {window.location.pathname = '/wallet/sell'}} className="text-sm mr-5 mt-3 px-2 py-1 md:mr-2 xl:mr-5 border-2 border-trigon_green rounded-full hover:text-trigon_green cursor-pointer">sell</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 bg-trigon_gray-300 my-2 rounded-md md:w-11/12 md:mx-auto">
                    <div ref={node => this.chartRect = node} className="m-3">
                      <h1 className="text-xl xl:text-3xl mb-3 md:w-11/12">Trigon chart</h1>
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                            chart: {
                                className: "chart_container",
                                type: "line",
                                backgroundColor: "#252529",
                                zoomType: 'x'
                            },
            
                            plotOptions: {
                                line: {
                                    color: "#7AC231"
                                }
                            },
                            
                            series: [
                                {   name: "Price",
                                    data: this.state.chart_data,
                                    marker: {
                                        enabled: true,
                                        radius: 3
                                    },
                                    shadow: true,
                                    tooltip: {
                                        
                                    }
                                }
                            ],
            
                            title: {
                                color: "#606166",
                                text: "Sell Price"
                            },

                            legend: {
                                align: 'left',
                                itemStyle: {
                                    "color": "#7AC231"
                                },
                                labelFormat: "{name}",
                                itemHoverStyle: {
                                    "color": "#42434B"
                                },
                                itemHiddenStyle: {
                                    "color": "#606166"
                                },
                                verticalAlign: 'top',
                                x: -10,
                                y: 0,
                                floating: true
                            },
            
                            // tooltip: {
                            //     headerFormat: "",
                            //     pointFormat: "{point.x:%e. %b}: {point.y:.2f} ETH",
                            // },

                            xAxis: {
                                type: "datetime",
                                // dateTimeLabelFormats: {
                                //     month: '%e. %b',
                                //     year: "%b"
                                // },
                                // tickInterval: 7 * 24 * 3600 * 1000,
                                // tickWidth: 0,
                                // gridLineWidth: 1,
                                // labels: {
                                // useHTML: true,
                                // // format: ""
                                // //     formatter: function () {
                                // //         return "";
                                // //     }
                                // }
                            },
            
                            yAxis: {

                                 labels: {
                                    align: 'right',
                                    x: -3,
                                    format: '{value:.,0f}'
                                },
                                showFirstLabel: true,
                                title: {
                                    color: "#606166",
                                    text: ""
                                }
                            }
                        }}/>
                      {/* <ParentSize>{({ width, height }) => <NewChart width={this.state.chart_width-30} height={370} chart_data={this.state.chart_data} />}</ParentSize> */}
                    </div>
                </div>
            </div>
        );

    }
}

export default MainContent;