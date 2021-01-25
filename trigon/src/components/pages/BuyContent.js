import React, {Component} from 'react';
import TopBar from '../common/TopBar';
import CompletedModal from '../common/CompletedModal';
import Overlay from '../common/Overlay';

import '../../styles/buycontent.css';
import { contract, methods, owner_address } from '../../trigon_interface/interface';
import axios from 'axios';

class BuyContent extends Component {
    constructor(props) {
        super(props);

        this.ethereum = window.ethereum;
        this.w3 = window.web3;

        this.state = {
            account_eth_balance: 0,
            trigon_balance: 0,
            basePrice: 0,
            admin_commission: 0,
            ref_commission: 0,
            growth_commission: 0,
            buyPrice: 0,
            calculatedPrice: 0,
            usd_price: 0,
            showBalance: true,
            show_modal: false,
            show_overlay: false,
            success_transaction: '',
            transaction_processing: true,
            transaction_success: false,
            provided_address: ''
        }
    }

    clearInput = () => {
        this.amount.value = '';
        this.referrer.value = '';

        this.setState({
            showBalance: true
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

    getBasePrice = async () => {
        await methods.price().call().then(res => {
            let price = res/10e17;

            this.setState({
                basePrice: price
            })
        })
    }

    getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
      }

    calculatePrice = async (e) => {
        let basePrice = this.state.basePrice;
        let { admin_commission, ref_commission, growth_commission } = this.state;
        let amount = parseFloat(e.target.value);
        
        if(isNaN(amount)) {
            this.setState({
                calculatedPrice: 0,
                showBalance: true
            })
            return
        }

        let calculatedPrice = ((basePrice * (1 + admin_commission + ref_commission)) / (1 - growth_commission)) * amount;

        this.setState({
            calculatedPrice: calculatedPrice,
            showBalance: calculatedPrice === 0
        })
    }

    getBuyCommission = async () => {
        const admin_commission = await methods.getCommissionAdmin().call().then(res => res);
        const ref_commission = await methods.getCommissionRef().call().then(res => res);
        const growth_commission = await methods.getCommissionCost().call().then(res => res);

        this.setState({
            admin_commission: parseFloat(admin_commission)/100,
            ref_commission: parseFloat(ref_commission)/100,
            growth_commission: parseFloat(growth_commission)/100
        });
    }

    getUSDPrice = () => {
        axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD').then(res => {
            this.setState({
                usd_price: res.data.USD
            })
        })
    }

    closeModal = () => {
        this.setState({
            show_modal: false,
            show_overlay: false
        })
    }

    buyTokens = async () => {
        this.getUSDPrice();
        let minPrice;

        if(!this.ethereum) {
            alert("Install Metamask to perform transactions");
            return;
        }

        if(!this.ethereum.selectedAddress) {
            alert("Login to metamask to perform transactions");
            return;
        }

        methods.isInitialize().call().then(async (res) => {

            if(res) {
                minPrice = (1.0 / this.state.usd_price) * 10;

                if(this.state.calculatedPrice < minPrice) {
                    alert(`Minimal buy amount should be more than ${minPrice} ETH`)
                    return;
                }


                this.setState({
                    show_overlay: true
                })

                methods.buytoken(this.state.provided_address).send({from: this.ethereum.selectedAddress, value: (this.state.calculatedPrice * 10e17)}).then(res => {
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

                return;
            }

            minPrice = this.state.calculatedPrice;

            let lowerOwnerAddress = owner_address.toLowerCase();

            if(this.ethereum.selectedAddress !== lowerOwnerAddress) {
                alert("Only owner can send first transaction");
                return;
            }

            if(minPrice < 0.001) {
                alert("Min init price is 0.001 ETH");
                return;
            }

            await methods.init().send({from: this.ethereum.selectedAddress, value: (this.state.calculatedPrice * 10e17)}).then(res => {
                this.getBalance();
                this.getTrigonBalance();
                this.getBasePrice();
                this.getBuyCommission();
                this.getUSDPrice();
            });

        })

    }

    componentDidMount() {
        this.getBalance();
        this.getTrigonBalance();
        this.getBasePrice();
        this.getBuyCommission();
        this.getUSDPrice();

        let address = this.getCookie('trigon');

        if(address === 'wc-ajax=get_refreshed_fragments') {
            address = owner_address;
        }

        if(this.ethereum) {
            if(address === this.ethereum.selectedAddress) {
                address = owner_address;
            }
        }

        this.setState({
            provided_address: address ? address : owner_address
        });

        // this.buyInput.focus()

        if(this.ethereum) {
            this.w3.setProvider(this.ethereum);

            this.ethereum.on('accountsChanged', (accounts) => {
                this.getTrigonBalance();
                this.getBalance();
            });
        }

        contract.events.Price().on('data', async (event) => {

            this.getBuyCommission();

            let basePrice = parseFloat(event.returnValues.value)/10e17;

            this.setState({
                basePrice: basePrice,
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
            <div className="flex flex-col w-11/12 md:w-11/12 mx-auto md:mt-2 md:mt-2 md:mx-0 md:ml-1 md:mr-5">
                {
                    this.state.show_overlay && <Overlay />
                }
                {
                    this.state.show_modal && <CompletedModal closeModal={this.closeModal} processing={this.state.transaction_processing} success={this.state.transaction_success} transaction={this.state.success_transaction}/>
                }
                <div className="flex flex-row justify-between md:w-11/12 md:mx-auto text-left text-xl">
                    <h1 className="mt-4">Buy TRGN</h1>
                    {
                        window.innerWidth >= 768 ? <div className="flex justify-between w-3/12 mt-4 bg-trigon_gray-300 rounded-md pt-2 px-2 text-sm mx-auto"><span>Balance:</span> {this.state.account_eth_balance} ETH</div> : null
                    }
                    {
                        window.innerWidth < 768 ? <div className="mt-4">{this.state.account_eth_balance} ETH</div> : <TopBar />
                    }
                </div>
                <div className="mt-3 md:mt-8 w-full md:w-10/12 mx-auto bg-trigon_gray-300 rounded-lg">
                    <div className="flex flex-col pt-5 w-11/12 mx-auto">
                        <div className="flex flex-row justify-between">
                            <label htmlFor="buy" className="mb-2">TRGN amount</label>
                            {
                                this.state.showBalance ? 
                                    <p className="text-md">You have {this.state.trigon_balance} TRGN</p> :
                                    <p className="text-md">ETH to pay {(this.state.calculatedPrice).toFixed(8)}</p>
                            }
                        </div>
                        <input ref={node => this.buyInput = node} value={this.state.tokenAmount} onChange={(e) => this.calculatePrice(e)} ref={node => this.amount = node} type="number" className="bg-trigon_gray-100 rounded-lg pl-3 outline-none py-2 text-lg" placeholder="Enter TRGN amount" name="buy" id='buy' required />
                    </div>
                    <div className="flex flex-col pt-5 pb-3 w-11/12 mx-auto">
                        <label htmlFor="referrer" className="mb-2">Referrer address</label>
                        <input value={this.state.provided_address} disabled={true} ref={node => this.referrer = node} type="text" className="bg-trigon_gray-100 rounded-lg pl-3 outline-none py-2 text-xs md:text-lg" placeholder="Enter Referrer address" name="referrer" id='referrer' required />
                    </div>
                    <div className="flex flex-row justify-between w-11/12 pb-5 md:pb-64 mx-auto">
                        <span onClick={this.clearInput} className="py-2 px-3 border-2 border-trigon_gray-100 bg-trigon_gray-300 hover:bg-trigon_gray-100 rounded-lg cursor-pointer">Clear</span>
                        <span onClick={this.buyTokens} className="py-2 px-3 border-2 border-trigon_gray-100 bg-trigon_gray-300 hover:bg-trigon_gray-100 rounded-lg cursor-pointer">Buy</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default BuyContent;