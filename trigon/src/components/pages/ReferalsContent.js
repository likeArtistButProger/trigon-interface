import React, {Component} from 'react';
import TopBar from '../common/TopBar';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import axios from 'axios';

import { methods } from '../../trigon_interface/interface';

import '../../styles/buycontent.css';

class ReferalsContent extends Component {
    constructor(props) {
        super(props);

        this.w3 = window.web3;
        this.ethereum = window.ethereum;

        this.state = {
            account_eth_balance: 0,
            account_trgn_balance: 0,
            copied: false,
            usd_price: null,
            base_price: null,
            buyPrice: null,
            growth_commission: null,
            admin_commission: null,
            ref_commission: null,
            allow_ref: false,
            isMobile: false
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
                    eth_balance = this.w3.utils.fromWei(balance, "ether") + "";
                    eth_balance = parseFloat(eth_balance).toFixed(4);
                    this.setState({
                        account_eth_balance: eth_balance,
                    })
                });
            }
        }
    }

    getPrice = async () => {
        await methods.price().call().then(res => {
            let basePrice = res/10e17;
            let adm_com = this.state.admin_commission;
            let ref_com = this.state.ref_commission;
            let growth_commission = this.state.growth_commission;
            this.setState({
                basePrice: basePrice,
                buyPrice: ((basePrice*(1+adm_com+ref_com))/(1 - growth_commission)),
            });
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

    getEtheriumPrice = async () => {
        await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD').then(res => {
            this.setState({
                usd_price: res.data.USD
            })
        })
    }

    getTrigonBalance = async () => {
        if(this.ethereum) {
            let address = this.ethereum.selectedAddress;

            if(address) {
                await methods.balanceOf(address).call().then(res => {
                        this.setState({
                            account_trgn_balance: res/10e17
                        })
                    }  
                );
               
            }
        }
    }

    mobileAndTabletCheck = function() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        
        this.setState({
            isMobile: check
        })
      };

    componentDidMount() {
        this.getBalance()
        .then(async () => {
            await this.getBuyCommission();
        }).then(async () => {
            await this.getPrice();
        }).then(async () => {
            await this.getEtheriumPrice();
        }).then(async () => {
            await this.getTrigonBalance();
        }).then(() => {
            const balanceInUSD = this.state.account_trgn_balance * this.state.buyPrice * this.state.usd_price;
            if(balanceInUSD > 50) {
                this.setState({
                    allow_ref: true
                });
            };
        });

        if(this.ethereum) {
            this.w3.setProvider(this.ethereum);

            this.ethereum.on('accountsChanged', (accounts) => {
                this.getBalance();
                const balanceInUSD = this.state.account_trgn_balance * this.state.buyPrice * this.state.usd_price;
                if(balanceInUSD > 50) {
                    this.setState({
                        allow_ref: true
                    });
                };
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
                    <div className="relative mt-3 p-3 w-11/12 md:w-10/12 mt-2 mx-auto bg-trigon_gray-300 rounded-lg">
                        Invite A Friend. Earn Stable Growing Trigon Tokens (TRGN). <br />  <br />

                        We want to thank our loyal Trigon users for the continuous support. <br />  <br />

                        In line with this, the Trigon team is happy to announce that we are running an “Invite a Friend” campaign. Get your family, friends and colleagues to start using the Trigon token and earn some Trigon Token (TRGN) for that. <br />  <br />

                        When a new user buys Trigon tokens for $50+ worth of Ethereum through your referral link, you will receive 5% TRGN tokens to your wallet balance. The more referrals you invite, the more TRGN tokens you will earn. <br />  <br />

                        So start now and get more people onboarded with Trigon token.
                    </div>
                    <div className="mt-3 w-11/12 md:w-10/12 mt-2 mx-auto bg-trigon_gray-300 rounded-lg">
                        <div className="relative flex flex-row my-3 ml-2 grid grid-cols-1 gap-3">
                            {
                                this.state.allow_ref ?
                                <div className="flex flex-col md:flex-row justify-between">
                                    <span className="my-auto" style={{userSelect: "none"}}>Referral link: <span id="link"  style={{userSelect: 'text'}} id="referral_link" className="text-sm md:text-md xl:text-md text-trigon_green cursor-pointer"> {this.ethereum ? `http://trigon.plus/?${this.ethereum.selectedAddress}` : "Connect with meramask to get your ref"} </span></span>
                                    <CopyToClipboard text={`http://trigon.plus/?${this.ethereum.selectedAddress}`}>
                                        <svg id="copy" onClick={() => this.setState({copied: true})} className="mr-4 p-1 rounded-md bg-trigon_gray-100 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="#979797" width="28" height="28" viewBox="0 0 24 24"><path d="M16 10c3.469 0 2 4 2 4s4-1.594 4 2v6h-10v-12h4zm.827-2h-6.827v16h14v-8.842c0-2.392-4.011-7.158-7.173-7.158zm-8.827 12h-6v-16h4l2.102 2h3.898l2-2h4v2.145c.656.143 1.327.391 2 .754v-4.899h-3c-1.229 0-2.18-1.084-3-2h-8c-.82.916-1.771 2-3 2h-3v20h8v-2zm2-18c.553 0 1 .448 1 1s-.447 1-1 1-1-.448-1-1 .447-1 1-1zm4 18h6v-1h-6v1zm0-2h6v-1h-6v1zm0-2h6v-1h-6v1z"/></svg>
                                    </CopyToClipboard>
                                </div> 
                                :
                                    <div style={{color: "#e6a800"}} className="text-xs">
                                        To activate your referral link, you must have Trigon tokens in your balance (min buy $50 worth Ethereum)
                                    </div>
                            }
                            
                            {  
                                !this.state.isMobile && this.state.allow_ref && this.state.copied && <div style={{bottom: window.innerWidth >= 768 ? "-50%" : "-20%", right: window.innerWidth >= 768 ? "0" : "65%", whiteSpace: "nowrap"}} className="absolute text-xs">Copied to clipboard</div>
                            }
                        </div>
                    </div>

                </div>
            </div>
        </div>
        );
    }
}

export default ReferalsContent;