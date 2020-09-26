import React, {Component} from 'react';

import TopBar from '../common/TopBar';

import '../../styles/buycontent.css';

import { methods } from '../../trigon_interface/interface';

class ReferalsContent extends Component {
    constructor(props) {
        super(props);

        this.w3 = window.web3;
        this.ethereum = window.ethereum;

        this.state = {
            account_eth_balance: 0
        }
    }

    clearInput = () => {
        this.amount.value = '';
        this.referrer.value = '';
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

    componentDidMount() {
        this.getBalance();

        if(this.ethereum) {
            this.w3.setProvider(this.ethereum);

            this.ethereum.on('accountsChanged', (accounts) => {
                this.getBalance();
            })
        }
    }

    render() {
        return(
            <div className="w-full flex flex-col">
                <div className="flex flex-row justify-between mx-2 md:w-11/12 md:mx-auto text-left mt-3 text-xl">
                        <h1 className="mt-4">Referral stats</h1>
                        {
                        window.innerWidth >= 768 ? <div className="flex justify-between w-3/12 mt-4 bg-trigon_gray-300 rounded-md pt-2 px-2 text-sm mx-auto"><span>Balance:</span>{this.state.account_eth_balance} ETH</div> : null
                        }
                        {
                            window.innerWidth < 768 ? <div className="mt-4">{this.state.account_eth_balance} ETH</div> : <TopBar />
                        }
                </div>
            <div className="w-full grid grid-cols-1 md:w-3/4 mx-auto lg:w-1/2">
                
                <div className="grid grid-cols-1 gap-2 w-11/12 md:w-11/12 mx-auto md:mx-0 md:ml-1">
                    {/* <div className="mt-5 w-11/12 md:w-10/12  mx-auto bg-trigon_gray-300 rounded-lg">
                        <div className="mt-5  ml-2 grid grid-cols-1 gap-3">
                            <span className="flex flex-row mb-6 text-md">Invited referrals: <span className="ml-auto mr-3">30</span> </span>
                        </div>
                    </div>
                    <div className="mt-3 w-11/12 md:w-10/12  mx-auto bg-trigon_gray-300 rounded-lg">
                        <div className="mt-5 ml-2 grid grid-cols-1 gap-3">
                            <span className="flex flex-row mb-6 texl-md">Referrals invested: <span className="ml-auto mr-3 font-bold text-trigon_green">250 ETH</span></span>
                        </div>
                    </div>
                    <div className="mt-3 w-11/12 md:w-10/12  mx-auto bg-trigon_gray-300 rounded-lg">
                        <div className="mt-5 ml-2 grid grid-cols-1 gap-3">
                            <span className="flex flex-row mb-6 text-md">Earnings: <span className="font-bold mr-3 ml-auto">500 TRGN</span></span>
                        </div>
                    </div> */}
                    <div className="relative mt-3 w-11/12 md:w-10/12 mt-2 mx-auto bg-trigon_gray-300 rounded-lg row-start-4">
                        <div className="flex flex-row my-3 ml-2 grid grid-cols-1 gap-3">
                            <div>
                                <span style={{userSelect: "none"}} className="">Referral link: <span style={{userSelect: 'text'}} className="text-sm md:text-md xl:text-md text-trigon_green"> https://google.com/35235325235523.jpg </span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default ReferalsContent;