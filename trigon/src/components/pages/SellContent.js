import React, {Component} from 'react';

import TopBar from '../common/TopBar';
import Overlay from '../common/Overlay';

import '../../styles/buycontent.css';

import CompletedModal from '../common/CompletedModal';
import { contract, methods } from '../../trigon_interface/interface';

class SellContent extends Component {
    constructor(props) {
        super(props);

        this.w3 = window.web3;
        this.ethereum = window.ethereum;

        this.state = {
            account_eth_balance: 0,
            trigon_balance: 0,
            basePrice: 0,
            sellCommission: 0,
            amount: 0,
            calculatedPrice: 0,
            show_modal: false,
            show_overlay: false,
            showBalance: true,
            success_transaction: '',
            transaction_processing: true,
            transaction_success: false
        }
    }

    clearInput = () => {
        this.amount.value = '';

        this.setState({
            calculatedPrice: 0,
            showBalance: true
        });
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

    getPrice = async () => {
        await methods.price().call().then(res => {
            this.setState({
                basePrice: res/10e17
            })
        })
    }

    getTrigonBalance = async () => {
        if(this.ethereum) {
            if(this.ethereum.selectedAddress) {
                let address = this.ethereum.selectedAddress;
                methods.balanceOf(address).call().then(res => {
                    this.setState({
                        trigon_balance: (parseFloat(res)/10e17).toFixed(4)
                    })
                })
            }
        }
    }

    getSellCommission = async () => {
        await methods.getCommissionCost().call().then(res => {
            this.setState({
                sellCommission: parseFloat(res)/100
            })
        })
    }
    
    closeModal = () => {
        this.setState({
            show_modal: false,
            show_overlay: false
        })
    }

    sellTokens = async () => {
        if(!this.ethereum) {
            alert("Install metamask to sell tokens");
            return;
        }

        let trigon_balance = parseFloat(this.state.trigon_balance);
        let amount = parseFloat(this.state.amount); 

        console.log(this.state.amount);

        if(isNaN(amount) || amount === 0) {
            alert("Please write correct amount of tokens");
            return;
        }

        if(amount > 999) {
            alert("You can sell 999 tokens per time");
            return;
        }

        if(amount > trigon_balance) {
            alert("Not enough tokens to sell");
            return;
        }

        await methods.isInitialize().call().then(async (res) => {
            if(!res) {
                alert("Tokens isn't initialized yet!")
                return;
            }

            this.setState({
                show_overlay: true
            })

            let tokensToSell = (amount*10e17).toString();

            methods.sell(tokensToSell).send({from: this.ethereum.selectedAddress}).then(res => {
                this.setState({
                    success_transaction: res.transactionHash,
                    transaction_success: true,
                    transaction_processing: false,
                    show_modal: true,
                    show_overlay: false
                })

                this.getBalance();
                this.getTrigonBalance();

            }).catch(error => {
                this.setState({
                    transaction_success: false,
                    transaction_processing: false,
                    show_modal: true,
                    show_overlay: false
                })
            })

        });
    }

    calculatePrice = async (e) => {
        let basePrice = this.state.basePrice;
        let commisssion = this.state.sellCommission;
        let amount = parseFloat(e.target.value);
        
        if(isNaN(amount)) {
            this.setState({
                calculatedPrice: 0,
                showBalance: true
            })
            return
        }

        let calculatedPrice = ((1 - commisssion) * basePrice) * amount;

        this.setState({
            calculatedPrice: calculatedPrice,
            showBalance: calculatedPrice === 0,
            amount: amount
        })
    }

    componentDidMount() {
        this.getBalance();
        this.getTrigonBalance();
        this.getSellCommission();
        this.getPrice();

        if(this.ethereum) {
            this.w3.setProvider(this.ethereum);

            this.ethereum.on('accountsChanged', (accounts) => {
                this.getTrigonBalance();
                this.getBalance();
            })
        }

        contract.events.Price().on('data', async (event) => {

            this.getSellCommission().then(() => {
                let basePrice = parseFloat(event.returnValues.value)/10e18;

                this.setState({
                    basePrice: basePrice,
                });
            });

        })
        .on('error', console.error);

        contract.events.Transfer().on('data', async (event) => {
            this.getTrigonBalance();
        }).on('error', (error) => {
            console.log(error);
        })

    }

    render() {
        return(
            <div className="flex flex-col w-11/12 md:w-11/12 mx-auto md:mx-0 md:ml-1">
                {
                    this.state.show_overlay && <Overlay />
                }
                {
                    this.state.show_modal && <CompletedModal closeModal={this.closeModal} processing={this.state.transaction_processing} success={this.state.transaction_success} transaction={this.state.success_transaction}/>
                }
                <div className="flex flex-row justify-between md:w-11/12 md:mx-auto text-left mt-3 text-xl">
                    <h1 className="mt-4">Sell TRGN</h1>
                    {
                        window.innerWidth >= 768 ? <div className="flex justify-between w-3/12 mt-4 bg-trigon_gray-300 rounded-md pt-2 px-2 text-sm mx-auto"><span>Balance:</span> {this.state.account_eth_balance} ETH</div> : null
                    }
                    {
                        window.innerWidth < 768 ? <div className="mt-4">{this.state.account_eth_balance} ETH</div> : <TopBar />
                    }
                </div>
                <div className="mt-8 w-full md:w-10/12  mx-auto bg-trigon_gray-300 rounded-lg">
                    <div className="flex flex-col pt-5 w-11/12 mx-auto mb-3">
                        <div className="flex flex-row justify-between">
                            <label htmlFor="buy" className="mb-2">TRGN SALE amount</label>
                            {
                                this.state.showBalance 
                                ?   <p>You have {this.state.trigon_balance} TRGN</p>
                                :   <p>You receive {this.state.calculatedPrice.toFixed(8)}</p>
                            }
                        </div>
                        <input onChange={(e) => this.calculatePrice(e)} ref={node => this.amount = node} type="number" className="bg-trigon_gray-100 rounded-lg pl-3 outline-none py-2 text-lg" placeholder="Enter TRGN amount" name="buy" id='buy' required />
                    </div>
                    <div className="flex flex-row justify-between w-11/12 pb-5 md:pb-64 mx-auto">
                        <span onClick={this.clearInput} className="py-2 px-3 border-2 border-trigon_gray-100 bg-trigon_gray-300 hover:bg-trigon_gray-100 rounded-lg cursor-pointer">Clear</span>
                        <span onClick={this.sellTokens} className="py-2 px-3 border-2 border-trigon_gray-100 bg-trigon_gray-300 hover:bg-trigon_gray-100 rounded-lg cursor-pointer">Sell</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default SellContent;