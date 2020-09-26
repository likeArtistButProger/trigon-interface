import React, {Component} from 'react';
import { LineChart, XAxis, Tooltip, CartesianGrid, Line } from 'recharts';
import TopBar from '../common/TopBar';
import axios from 'axios';

import '../../styles/maincontent.css';
import TrigonImage from '../../assets/trigon_coin.png';

import { contract, events, methods } from '../../trigon_interface/interface';

class MainContent extends Component {
    constructor(props) {
        super(props);

        this.w3 = window.web3;
        this.ethereum = window.ethereum;

        this.state = {
            chart_data: [
                { name: '12:12:2000', uv: 2000, pv: 1200, amt: 2400, uvError: [0, 50] },
                { name: 'February', uv: 300, pv: 4567, amt: 2400, uvError: [90, 40] },
                { name: 'March', uv: 280, pv: 1398, amt: 2400, uvError: 40 },
                { name: 'April', uv: 200, pv: 9800, amt: 2400, uvError: 20 },
                { name: 'May', uv: 278, pv: null, amt: 2400, uvError: 28 },
                { name: 'June', uv: 189, pv: 4800, amt: 2400, uvError: [90, 20] },
                { name: 'Jule', uv: 189, pv: 4800, amt: 2400, uvError: [28, 40] },
                { name: 'August', uv: 189, pv: 4800, amt: 2400, uvError: 28 },
                { name: 'September', uv: 189, pv: 4800, amt: 2400, uvError: 28 },
                { name: 'October', uv: 189, pv: 4800, amt: 2400, uvError: [15, 60] },
            ],
            chart_width: window.innerWidth >= 767 ? window.innerWidth*0.87 : window.innerWidth*0.9,
            chart_margin: window.innerWidth >= 767 ? window.innerWidth/25 : 5,
            account_eth_balance: 0,
            trigon_balance: 0,
            totalSupply: 0,
            totalEthSupply: 0,
            basePrice: 0,
            buyPrice: 0,
            sellPrice: 0,
            usd_price: 0,
            buyCommission: 0,
            sellCommission: 0
        }
    }

    updateSize = () => {
        this.setState({
            chart_width: window.innerWidth >= 767 ? window.innerWidth*0.87 : window.innerWidth*0.9,
            chart_margin: window.innerWidth >= 767 ? window.innerWidth/28 : 5
        })
    }

    getBalance = async () => {
        if(this.ethereum) {
            if(this.ethereum.selectedAddress !== null) {
                let address = this.ethereum.selectedAddress;
                let eth_balance;
                const balance = await this.w3.eth.getBalance(address, (error, balance) => {
                    eth_balance = this.w3.fromWei(balance, "ether") + "";
                    eth_balance = parseFloat(eth_balance).toFixed(4);
                    console.log("Eth balance:", eth_balance);
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
                            trigon_balance: (res/10e17).toFixed(4)
                        })
                    }  
                );
               
            }
        }
    }

    getTotalSupply = async () => {
        await methods.totalSupply().call().then(res => {
            this.setState({
                totalSupply: (res/10e17).toFixed(4)
            })
        })
    }

    getTotalEthSupply = async () => {
        await methods.bank().call().then(res => {
            this.setState({
                totalEthSupply: (res/10e17).toFixed(4)
            })
        });
    }

    getBuyCommission = async () => {
        await methods.getCommission().call().then(res => {
            this.setState({
                buyCommission: (parseInt(res[1]) + parseInt(res[2]) + parseInt(res[3]))/100
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
            this.setState({
                basePrice: basePrice,
                buyPrice: (basePrice/(1 - this.state.buyCommission)),
                sellPrice: ((1 - this.state.sellCommission) * basePrice)
            });
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateSize);

        this.getBalance();
        this.getTrigonBalance();
        this.getTotalSupply();
        this.getTotalEthSupply();
        this.getEtheriumPrice();
        this.getBuyCommission().then(this.getSellComission().then(this.getPrice()));

        if(this.ethereum) {
            this.w3.setProvider(this.ethereum);

            this.ethereum.on('accountsChanged', (accounts) => {
                this.getTrigonBalance();
                this.getBalance();
            })
        }

        contract.events.Price().on('data', async (event) => {

            this.getBuyCommission().then(this.getSellComission());

            let basePrice = parseFloat(event.returnValues.value)/10e17;
            let totalSupply = (parseFloat(event.returnValues.totalSupply)/10e17).toFixed(4);

            this.setState({
                basePrice: basePrice,
                buyPrice: (basePrice/(1 - this.state.buyCommission)),
                sellPrice: ((1 - this.state.sellCommission) * basePrice),
                totalSupply: totalSupply
            });

            this.getTrigonBalance();
            this.getEtheriumPrice();
            this.getTotalEthSupply();

        })
        .on('error', console.error);

        console.log(methods);
        // setInterval(this.getBalance, 1000);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSize);
    }

    render () {
        let { chart_data } = this.state

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
                                <p style={{whiteSpace: 'nowrap'}} id="usd_balance" className="relative text-sm md:text-md lg:text-lg">~ {(this.state.trigon_balance*this.state.basePrice*this.state.usd_price).toFixed(4)}</p>
                                <p id="eth_balance" className="relative text-sm md:text-md lg:text-lg">~ {(this.state.trigon_balance*this.state.basePrice).toFixed(4)}</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between pb-3 bg-trigon_green rounded-md">
                        <div className="flex flex-col justify-between">
                            <div className="flex flex-row justify-between my-3 md">
                                <span style={{color: "#65A028"}} className="ml-3 my-auto font-bold">
                                    Total TRGN Supply
                                </span>
                                <div style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}} className="w-10 h-10 mr-3 rounded-md">
                                    <img src={TrigonImage} alt="Trigon"/>
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
                                <span style={{color: "#65A028"}} className="ml-3 my-auto font-bold">
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
                            <span className="mt-4 my-auto ml-4 flex flex-row text-xs">{this.state.buyPrice.toFixed(10)} ETH <p className="text-trigon_green text-xs my-auto ml-2">+12%</p></span>
                            <span onClick={() => {window.location.pathname = '/buy'}} className="text-sm mr-5 mt-3 md:mr-2 xl:mr-5 px-2 py-1 border-2 border-trigon_green rounded-full hover:text-trigon_green cursor-pointer">buy</span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between pb-3 bg-trigon_gray-300 rounded-md md:row-start-2 md:col-start-3">
                        <div className="flex flex-row justify-between">
                            <span className="mt-4 my-auto ml-4 flex flex-row text-xs sm:text-md">{this.state.sellPrice.toFixed(10)} ETH <p className="text-trigon_green text-xs my-auto ml-2">+5%</p></span>
                            <span onClick={() => {window.location.pathname = '/sell'}} className="text-sm mr-5 mt-3 px-2 py-1 md:mr-2 xl:mr-5 border-2 border-trigon_green rounded-full hover:text-trigon_green cursor-pointer">sell</span>
                        </div>
                    </div>
                </div>
                <div className="w-11/12">
                    <h1 className="text-xl xl:text-3xl mb-3 md:w-11/12 mx-auto mt-8">Trigon chart</h1>
                    <LineChart
                    width={this.state.chart_width}
                    height={400}
                    data={chart_data}
                    margin={{ top: 5, right: 0, left: this.state.chart_margin, bottom: 5 }}
                    >
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
                    </LineChart>
                </div>
            </div>
        );

    }
}

export default MainContent;