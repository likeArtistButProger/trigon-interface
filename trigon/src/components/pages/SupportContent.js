import React, {Component} from 'react';

import TopBar from '../common/TopBar';

import '../../styles/buycontent.css';

class SendContent extends Component {
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

        setInterval(this.getBalance, 1000);
    }

    render() {
        return(
            <div className="flex flex-col w-11/12 md:w-11/12 mx-auto md:mx-0 md:ml-1">
                <div className="flex flex-row justify-between md:w-11/12 md:mx-auto text-left mt-3 text-xl">
                    <h1 className="mt-4 mr-4">FAQ</h1>
                    {
                        window.innerWidth >= 768 ? <div className="flex justify-between w-3/12 mt-4 bg-trigon_gray-300 rounded-md pt-2 px-2 text-sm mx-auto"><span>Balance:</span>{this.state.account_eth_balance} ETH</div> : null
                    }
                    {
                        window.innerWidth < 768 ? <div className="mt-4">{this.state.account_eth_balance} ETH</div> : <TopBar />
                    }
                </div>
                <div className="grid grid-cols-1 mt-3 w-11/12 md:w-3/4  mx-auto bg-trigon_gray-300 rounded-lg">
                    <div className="flex flex-col mt-3 justify-between w-11/12 mx-auto">
                        <div className="my-3">
                            <h2>What is the total supply for TRGN token?</h2>
                            <div className="mt-2 px-1 rounded-lg bg-trigon_gray-100">Smart contract mints the token only when one buys the token. As soon as ether is received by the smart contract and allocated in the liquidity pool, smart contract mint the amount of tokens bought and sends them back to the buyer address. And when one sells the tokens to the smart contract, it burns tokens received and sends ether to the seller address. Total supply depends on how many tokens are on hands.</div>
                        </div>
                        <div className="my-3">
                            <h2>How many tokens pre-minted?</h2>
                            <div className="mt-2 px-1 rounded-lg bg-trigon_gray-100">There are zero TRGN tokens pre-minted. To get the token minted, one must send ether to the smart contract liquidity pool.</div>
                        </div>
                        <div className="my-3">
                            <h2>How TRGN token price grows?</h2>
                            <div className="mt-2 px-1 rounded-lg bg-trigon_gray-100">Every time someone buy or sell the token, a commission fee is withheld, which is subsequently distributed to all minted tokens. Thus, every buy or sell operation increases the token price.</div>
                        </div>
                        <div className="my-3">
                            <h2>Is it safe? Can I lose my ether?</h2>
                            <div className="mt-2 px-1 rounded-lg bg-trigon_gray-100">Smart contract is immutable and cannot be changed or edited by anyone. In order to get ether, one have to sell TRGN tokens back to the smart contract. There is no other way to get ether from the smart contract liquidity pool.</div>
                        </div>
                        <div className="mt-3 mb-6">
                            <h2>What if TRGN token price will not grow?</h2>
                            <div className="mt-2 px-1 rounded-lg bg-trigon_gray-100">Unlike DEFI or other regular tokens, it was designed to always grow. The more people buy or even sell the token, the faster your token value will increase. Number of XXs you can make, depends on just how long you hodl.</div>
                        </div>
                        <div className="mt-3 mb-6">
                            <h2>How to buy TRGN token?</h2>
                            <div className="mt-2 px-1 rounded-lg bg-trigon_gray-100">Connect to the Trigon wallet through Metamask, click the buy tab in the menu, specify the number of tokens you want to acquire and click the Buy button. After you send ether to the smart contract, you will see TRGN tokens in your Trigon wallet balance.</div>
                        </div>
                        <div className="mt-3 mb-6">
                            <h2>How to sell TRGN token?</h2>
                            <div className="mt-2 px-1 rounded-lg bg-trigon_gray-100">To sell TRGN tokens, connect to the Trigon wallet through Metamask, click the sell tab in the menu, specify the number of tokens you want to sell and click the Sell button. After you send tokens to the smart contract, it will send ether to your address.</div>
                        </div>
                        <div className="mt-3 mb-6">
                            <h2>What is TRIN tokens?</h2>
                            <div className="mt-2 px-1 rounded-lg bg-trigon_gray-100">TRIN token is a Trigon governance token, allowing holders to vote and to share profits from all TRGN token sales, as 5% from all TRGN token sales are automatically distributed between all TRIN token holders. Total supply is 58000 TRIN tokens and 30000 TRIN tokens have been granted for free to the crypto community through the bounty campaign.</div>
                        </div>
                        <div className="mt-3 mb-6">
                            <h2>Do you have referral program?</h2>
                            <div className="mt-2 px-1 rounded-lg bg-trigon_gray-100">Yes, invite others to buy TRGN tokens and earn 5% from the amount of tokens they acquired. The referral link can be found by clicking the Referral tab in the menu.</div>
                        </div>
                        <div className="mt-3 mb-6">
                            <h2>Why do i see a notice about the possible price change?</h2>
                            <div className="mt-2 px-1 rounded-lg bg-trigon_gray-100">Smart contract increases the price every time the token is bought or sold. Therefore, if someone bought a token just before you click the buy button, then the buy price of the token will rise for you. This may not occure in your case, but the notice is there so you know it is possible.</div>
                        </div>
                        <div className="mt-3 mb-6">
                            <h2>What if I have other questions?</h2>
                            <div className="mt-2 px-1 rounded-lg bg-trigon_gray-100">You're welcome to join our social groups, where you can get all the answers from fellow TRGN holders and the Trigon team. All links you can find on the left under the menu.</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SendContent;