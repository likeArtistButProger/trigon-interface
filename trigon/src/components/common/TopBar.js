import React, {Component} from 'react';

import '../../styles/topbar.css';
import MetamaskLogo from '../../assets/metamask_logo.png';

class TopBar extends Component {
    constructor(props) {
        super(props);

        this.ethereum = window.ethereum; 
        this.w3 = window.web3;

        this.state = {
            loggedIn: false,
            metamask_installed: false,
            show_login_modal: false,
            address: ''
        }
    }

    loginToMetamask = () => {
        if(this.ethereum) {
            this.setState({
                address: this.ethereum.request({ method: 'eth_requestAccounts' }),
             });
        } else {
            window.location.href = "https://metamask.io/"
        }
    }

    componentDidMount() {
        if(this.ethereum) {
            this.setState({
                metamask_installed: true
            })

            if(this.ethereum.selectedAddress !== null) {
                this.setState({
                    address: this.ethereum.selectedAddress,
                    loggedIn: true
                })
            }


            this.ethereum.on('accountsChanged', (accounts) => {
                this.setState({
                    address: accounts[0],
                    loggedIn: accounts.length > 0
                 });
            });

        }
    }

    switchModal = () => {
        this.setState({
            show_login_modal: !this.state.show_login_modal
        })
    }

    logout = () => {
        console.log(this.ethereum);
    }

    render () {
        let { loggedIn } = this.state;
        return (
            <div className="flex flex-row justify-end mt-3 md:mt-3 md:mr-3">
                {
                    loggedIn && 
                    <div id="notifications" className="mr-1 bg-trigon_gray-300 my-auto py-3 px-1 text-sm rounded-md">
                        {this.ethereum.selectedAddress !== null ? `${this.ethereum.selectedAddress.slice(0, 5)}...${this.ethereum.selectedAddress.slice(-3)}` : ""}
                    </div>
                }
                
                {/* {
                    loggedIn &&
                    <div id="refresh" className="mr-1 border-2 border-trigon_gray-300 rounded-lg cursor-pointer">
                        <svg className="h-full mt-2 ml-1 pl-1" xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 78 78">
                            <g>
                                <g>
                                <path fill="#979797" d="M47 2.5a2.5 2.5 0 0 0-5 0v4.18A25 25 0 0 0 5.44 40.57a2.5 2.5 0 1 0 3.9-3.14 20 20 0 0 1 29.37-27L33.77 10a2.5 2.5 0 0 0-.45 5l11 1h.62l.24-.05.23-.07.23-.1.21-.11.2-.14.18-.15c.06-.05.11-.11.17-.17l.1-.21.13-.2.12-.22.09-.22a2 2 0 0 0 .07-.23 1.19 1.19 0 0 0 .05-.26.61.61 0 0 0 0-.13v-.12-.11zM20.66 44.6a2.23 2.23 0 0 0-.51-.19 19.48 19.48 0 0 1-4.08-1.52c-.61-.3-1.21-.64-1.79-1l-.22-.13a2.5 2.5 0 0 0-2.45 4.35c.58.37 1.17.71 1.79 1h1.31l.11.05a25.14 25.14 0 0 0 4 1.38 2.5 2.5 0 0 0 1.72-4.66z"/>
                                    <g>
                                    <path fill="#979797" d="M31.35 44.65a2.47 2.47 0 0 0-1.7-.2 19.8 19.8 0 0 1-3.16.5 2.5 2.5 0 0 0-.92 4.73 2.45 2.45 0 0 0 1.29.25 25.23 25.23 0 0 0 4-.62 2.5 2.5 0 0 0 1.84-3 2.47 2.47 0 0 0-1.35-1.66zM39.47 40.88a2.5 2.5 0 0 0-2.6.23c-.43.31-.88.61-1.33.89a2.51 2.51 0 0 0-.81 3.44 2.5 2.5 0 0 0 3.44.81c.57-.35 1.12-.72 1.66-1.12a2.51 2.51 0 0 0-.36-4.25zM44.8 35.87a2.5 2.5 0 1 0 .68 3.47 2.51 2.51 0 0 0-.68-3.47z"/>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                } */}

                {
                    loggedIn && 
                    <div onClick={this.logout} id="logout" className="pl-2 pr-1 border-2 border-trigon_gray-300 rounded-lg cursor-pointer">
                        <svg className="mt-2 w-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#979797" viewBox="0 0 24 24"><path d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-16-7v20h14v-2h-12v-16h12v-2h-14z"/></svg>
                        {/* <svg width="24" className="mt-2" fill="#FFF" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M11 21h8.033v-2l1-1v4h-9.033v2l-10-3v-18l10-3v2h9.033v5l-1-1v-3h-8.033v18zm-1 1.656v-21.312l-8 2.4v16.512l8 2.4zm11.086-10.656l-3.293-3.293.707-.707 4.5 4.5-4.5 4.5-.707-.707 3.293-3.293h-9.053v-1h9.053z"/></svg> */}
                    </div>
                }

                {
                    !loggedIn && 
                    <div className="relative">
                        <div onClick={this.switchModal} id="login" className="px-3 py-3 my-auto border-2 border-trigon_gray-300 rounded-lg cursor-pointer">
                            <img className="w-4 h-4" src={MetamaskLogo} alt="Metamask"/>
                        </div>
                        {
                            this.state.show_login_modal &&
                            <div id="login_form" className="absolute right-auto w-56 h-14 border-2 border-trigon_gray-200 rounded-md p-2 bg-trigon_gray-300">
                                <div className="flex flex-row justify-center">
                                    <div onClick={this.loginToMetamask} id={this.state.loggedIn ? '' : "login_button"}
                                         style={{
                                             userSelect: this.state.loggedIn ? '' : 'none',
                                             cursor: this.state.loggedIn ? '' : 'pointer'
                                            }} 
                                         className="text-sm my-auto py-2 px-6 bg-trigon_gray-200 rounded-lg">

                                            {this.state.metamask_installed ? 'Connect' : 'Install metamask'}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                  
                }   

            </div>
        )
    }
}

export default TopBar;