import React, {Component} from 'react';

import '../../styles/topbar.css';
import MetamaskLogo from '../../assets/metamask_logo.png';

class TopBar extends Component {
    constructor(props) {
        super(props);

        this.ethereum = window.ethereum; 

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

    render () {
        let { loggedIn } = this.state;
        return (
            <div className="flex flex-row justify-end mt-3 md:mt-3 md:mr-3">
                {
                    loggedIn && 
                    <div onClick={() => {window.location.pathname = "/support"}} id="notifications" className="mr-1 border-2 border-trigon_gray-300 rounded-lg cursor-pointer">
                        {this.ethereum.selectedAddress !== null ? `${this.ethereum.selectedAddress.slice(0, 5)}...${this.ethereum.selectedAddress.slice(-3)}` : ""}
                    </div>
                }
                
                {
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
                }

                {
                    loggedIn && 
                    <div id="logout" className="px-3 border-2 border-trigon_gray-300 rounded-lg cursor-pointer">
                        <svg className="h-full my-auto" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="#3F4048"/>
                        </svg>
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
                            <div id="login_form" className="absolute right-auto w-56 h-16 border-2 border-trigon_gray-200 rounded-md p-2 bg-trigon_gray-300">
                                <div className="flex flex-row justify-center mt-2">
                                    <div onClick={this.loginToMetamask} id={this.state.loggedIn ? '' : "login_button"}
                                         style={{
                                             userSelect: this.state.loggedIn ? '' : 'none',
                                             cursor: this.state.loggedIn ? '' : 'pointer'
                                            }} 
                                         className="text-sm my-auto py-2 px-6 bg-trigon_gray-200 rounded-lg">

                                            {this.state.metamask_installed ? 'Connect to metamask' : 'Install metamask'}
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