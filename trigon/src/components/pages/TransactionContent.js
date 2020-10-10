import React, {Component} from 'react';
import TopBar from '../common/TopBar';
import TransactionCard from '../common/TransactionCard';
import { trigon_new } from '../../trigon_interface/interface';

import '../../styles/buycontent.css';

import axios from 'axios';

class TransactionContent extends Component {
    constructor(props) {
        super(props);

        this.w3 = window.web3;
        this.ethereum = window.ethereum;

        this.state = {
            account_eth_balance: 0,
            transactions: []
        }
    }

    clearInput = () => {
        this.amount.value = '';
        this.receiver.value = '';
    }

    getBalance = async () => {
        if(this.ethereum) {
            if(this.ethereum.selectedAddress !== null) {
                let address = this.ethereum.selectedAddress;
                let eth_balance;
                const balance = await this.w3.eth.getBalance(address, (error, balance) => {
                    eth_balance = this.w3.fromWei(balance, "ether") + "";
                    eth_balance = parseFloat(eth_balance).toFixed(4);
                    this.setState({
                        account_eth_balance: eth_balance
                    })
                });
            }
        }
    }

    getTransactionsHistory = () => {
        if(this.ethereum) {
            const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${this.ethereum.selectedAddress}&startblock=0&endblock=999999999&sort=asc&apikey=9AE3Y4JWHMNCRWDT1R9MNDUF5HK6P96MSH`
            axios.get(url)
            .then(res => {
                const data = res.data.result;

                if(data.length === 0) return;

                let clearData = data.filter(item => item.contractAddress.toUpperCase() === trigon_new.toUpperCase());


                clearData = clearData.map(transaction => {
                    return {
                        hash: transaction.hash,
                        value: (parseFloat(transaction.value) / 10e17).toFixed(4),
                        timeStamp: transaction.timeStamp
                    }
                });

                clearData = clearData.reverse();

                let reducedClearData = [];


                if(clearData.length > 30) {
                    for(let i = 0; i < 30; i++) {
                        reducedClearData.push(clearData[i])
                    }
                } else {
                    for(let i = 0; i < clearData.length; i++) {
                        reducedClearData.push(clearData[i])
                    }
                }


                this.setState({
                    transactions: reducedClearData
                })
            }).catch(err => {
                console.log(err);
            })
        }    
    }

    componentDidMount() {
        this.getBalance();
        this.getTransactionsHistory();

        if(this.ethereum) {
            this.w3.setProvider(this.ethereum);

            this.ethereum.on('accountsChanged', (accounts) => {
                this.getBalance();
                this.getTransactionsHistory();
            })
        }
    }

    render() {
        return(
            <div className="flex flex-col w-11/12 md:w-11/12 mx-auto md:mx-0 md:ml-1">
                <div className="flex flex-row justify-between md:w-11/12 md:mx-auto text-left mt-3 text-xl">
                    <h1 className="mt-4 mr-4">Transaction History</h1>
                    {
                        window.innerWidth >= 768 ? <div className="flex justify-between w-3/12 mt-4 bg-trigon_gray-300 rounded-md pt-2 px-2 text-sm mx-auto"><span>Balance:</span>{this.state.account_eth_balance} ETH</div> : null
                    }
                    {
                        window.innerWidth < 768 ? <div className="mt-4">{this.state.account_eth_balance} ETH</div> : <TopBar />
                    }
                </div>
                <div className="grid grid-cols-1 mt-3 w-11/12 md:w-3/4  mx-auto bg-trigon_gray-300 rounded-lg">
                <div className="m-3">
                    <h1 className="text-xl xl:text-3xl mb-3 md:w-11/12"></h1>
                    <div className="grid grid-cols-3 my-2 pl-2 rounded-md justify between">
                        <div className="flex text-trigon_green md:text-xs lg:text-sm xl:text-md flex-row justify-start">
                            <span>
                                Tx Hash
                            </span>
                        </div>
                        {
                            window.innerWidth >= 470 &&
                            <div className="flex text-trigon_green md:text-xs lg:text-sm xl:text-md flex-row justify-center">
                                <span>
                                    Date
                                </span>
                            </div>  
                        }
                        <div className="flex col-start-3 text-trigon_green md:text-xs lg:text-sm xl:text-md flex-row justify-center">
                            <span>
                                Value
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 justify-between">   
                        {
                            this.state.transactions.map(trans => {
                                return <TransactionCard hash={trans.hash} timeStamp={trans.timeStamp} sum={trans.value} key={trans.hash} />
                            })
                        }
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TransactionContent;