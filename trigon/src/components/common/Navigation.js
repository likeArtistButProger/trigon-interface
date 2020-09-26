import React, {Component} from 'react';

import Logo from '../../assets/logo.png';
import '../../styles/navigation.css';

class Navigation extends Component {
    constructor(props) {
        super(props);

        this.state =
        {
            active_tab: 0
        }
    }

    componentDidMount() {
        this.setState({
            active_tab: this.props.active_tab
        })
    }

    render() {
        return (
            <div id="navigation" style={{background: "#43444B"}} className="hidden md:grid grid-cols-1 w-20 h-screen bg-trigon_gray-100">
                <a href="http://trigon.plus">
                    <div className="w-12 h-12 mx-auto mt-5">
                        <img className="w-full h-full" src={Logo} alt="Logo" />
                    </div>
                </a>
                <a href='/' className="row-start-3">
                    <div className={`w-full h-full `.concat(this.state.active_tab === 0 ? "active" : "")}>
                        <svg className="h-full mx-auto my-auto" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M1.89956 0.0671387C1.32518 0.0671387 0.859558 0.532763 0.859558 1.10714V8.71366H7.30906V0.0671387H1.89956ZM15.0196 0.0671387H9.61005V5.26714H16.0596V1.10714C16.0596 0.532763 15.5939 0.0671387 15.0196 0.0671387ZM0.859558 10.5773H7.30906V15.7773H1.89956C1.32518 15.7773 0.859558 15.3117 0.859558 14.7373V10.5773ZM16.0596 7.13081H9.61005V15.7773H15.0196C15.5939 15.7773 16.0596 15.3117 16.0596 14.7373V7.13081Z" fill="#979797"/>
                        </svg>
                    </div>
                </a>
                <a href='/buy' className="row-start-4">
                    <div className={`w-full h-full `.concat(this.state.active_tab === 1 ? "active" : "")}>
                        <svg className="h-full mx-auto" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 50 47.56">
                            <g>
                                <g>
                                <path fill="#979797" d="M47.5 22.36h-45a2.63 2.63 0 0 0-.49.05l-.21.07a1.29 1.29 0 0 0-.26.08 1.67 1.67 0 0 0-.23.12 1.24 1.24 0 0 0-.2.1 2.55 2.55 0 0 0-.69.7l-.11.19a1.79 1.79 0 0 0-.12.24c0 .08 0 .17-.08.25a1.66 1.66 0 0 0-.06.21 2.31 2.31 0 0 0 0 1 1.8 1.8 0 0 0 .06.22c0 .08.05.17.08.25s.08.16.12.24l.11.19a1.91 1.91 0 0 0 .31.38l20.19 20.17a2.5 2.5 0 0 0 3.54-3.53L8.53 27.36h39a2.5 2.5 0 0 0 0-5z"/>
                                <rect fill="#979797" x="1.82" y="7.68" width="26.73" height="5" rx="2.5" ry="2.5" transform="rotate(-45 15.187 10.18)"/>
                                </g>
                            </g>
                        </svg>
                    </div>
                </a>
                <a href='/sell' className="row-start-5">
                    <div className={`w-full h-full `.concat(this.state.active_tab === 2 ? "active" : "")}>
                        <svg className="h-full mx-auto" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 50 47.56">
                            <g>
                                <g>
                                <path fill="#979797" d="M49.68 21.5a1.83 1.83 0 0 1 .13.24c0 .08 0 .17.08.25a1.66 1.66 0 0 1 .06.21 2.69 2.69 0 0 1 0 1 1.29 1.29 0 0 1-.06.21c0 .09 0 .18-.08.26s-.08.16-.13.24a1.74 1.74 0 0 1-.1.19 2.52 2.52 0 0 1-.69.69l-.2.11a2.53 2.53 0 0 1-.23.12 2.58 2.58 0 0 1-.26.08l-.21.06a2 2 0 0 1-.49.05h-45a2.5 2.5 0 0 1 0-5h39L25.54 4.27A2.5 2.5 0 0 1 29.08.73l20.19 20.19a3 3 0 0 1 .31.39 1.74 1.74 0 0 1 .1.19z"/>
                                <rect fill="#979797" x="21.45" y="34.87" width="26.73" height="5" rx="2.5" ry="2.5" transform="rotate(-45 34.822 37.376)"/>
                                </g>
                            </g>
                        </svg>
                    </div>
                </a>
                <a href='/send' className="row-start-6">
                    <div className={`w-full h-full `.concat(this.state.active_tab === 3 ? "active" : "")}>
                        <svg className='h-full mx-auto' xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 50 48">
                            <g>
                                <g id="Compare">
                                    <path fill="#979797" d="M49.89 34c0-.09 0-.17-.08-.25a1.83 1.83 0 0 0-.13-.24 1.14 1.14 0 0 0-.1-.19 3 3 0 0 0-.31-.39l-9.19-9.19a2.5 2.5 0 0 0-3.54 3.54l4.92 4.92H2.5a2.5 2.5 0 0 0 0 5h45a2 2 0 0 0 .49 0 1.66 1.66 0 0 0 .21-.06 2.58 2.58 0 0 0 .26-.08 2.53 2.53 0 0 0 .23-.12l.2-.11a2.52 2.52 0 0 0 .69-.69 1.24 1.24 0 0 0 .1-.2 1.71 1.71 0 0 0 .13-.23c0-.08 0-.17.08-.26a1.29 1.29 0 0 0 .06-.21 2.69 2.69 0 0 0 0-1 1.66 1.66 0 0 0-.06-.24zM.11 14.57c0 .08.05.17.08.25s.08.16.13.24a1.74 1.74 0 0 0 .1.19 2.33 2.33 0 0 0 .31.38l9.19 9.19a2.5 2.5 0 1 0 3.54-3.53l-4.92-4.93h39a2.5 2.5 0 0 0 0-5H2.5a2.72 2.72 0 0 0-.49.05l-.21.07a1.29 1.29 0 0 0-.26.08 2.53 2.53 0 0 0-.23.12l-.2.1a2.55 2.55 0 0 0-.69.7 1.74 1.74 0 0 0-.1.19 1.83 1.83 0 0 0-.13.24c0 .08 0 .17-.08.25a1.66 1.66 0 0 0-.06.21 2.69 2.69 0 0 0 0 1 1.8 1.8 0 0 0 .06.2z"/>
                                    <g><path fill="#979797" d="M44.27 39.92a2.52 2.52 0 0 0-3.54 0l-4.36 4.37a2.5 2.5 0 0 0 3.53 3.53l4.37-4.36a2.52 2.52 0 0 0 0-3.54zM10.1.73L5.73 5.1a2.5 2.5 0 0 0 3.54 3.53l4.36-4.36A2.5 2.5 0 0 0 10.1.73z"/>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                </a>
                <a href='/referral' className="row-start-7">
                    <div className={`w-full h-full `.concat(this.state.active_tab === 4 ? "active" : "")}>
                        <svg className="h-full mx-auto" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 44 50">
                        <g id="Layer_2" data-name="Layer 2">
                            <g id="Sharing">
                            <path fill="#979797" d="M28.41 12.88l-3-4-12.72 9.37 3 4 12.72-9.37zM16.58 26.63l-2.77 4.16 12.2 7.45 2.48-4.34-11.91-7.27z"/>
                            <g>
                                <path fill="#979797" d="M31.5 15A7.5 7.5 0 1 0 24 7.5a7.5 7.5 0 0 0 7.5 7.5zm0-10A2.5 2.5 0 1 1 29 7.5 2.5 2.5 0 0 1 31.5 5zM8.5 16a8.5 8.5 0 1 0 8.5 8.5A8.51 8.51 0 0 0 8.5 16zm0 12a3.5 3.5 0 1 1 3.5-3.5A3.5 3.5 0 0 1 8.5 28zM34.5 31a9.5 9.5 0 1 0 9.5 9.5 9.5 9.5 0 0 0-9.5-9.5zm0 14a4.5 4.5 0 1 1 4.5-4.5 4.51 4.51 0 0 1-4.5 4.5z"/>
                            </g>
                            </g>
                        </g>
                        </svg>
                    </div>
                </a>
                <a style={{gridRowStart: '8'}} href="/support">
                    <div className={`w-full h-full `.concat(this.state.active_tab === 5 ? "active" : "")}>
                        <svg className="h-full mx-auto pl-1 mb-1" width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M26 18H24V27H11V29C11 29.55 11.45 30 12 30H23L27 34V19C27 18.45 26.55 18 26 18ZM22 24V15C22 14.45 21.55 14 21 14H8C7.45 14 7 14.45 7 15V29L11 25H21C21.55 25 22 24.55 22 24Z" fill="#979797"/>
                            <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="7" y="14" width="20" height="20">
                                <path fillRule="evenodd" clipRule="evenodd" d="M26 18H24V27H11V29C11 29.55 11.45 30 12 30H23L27 34V19C27 18.45 26.55 18 26 18ZM22 24V15C22 14.45 21.55 14 21 14H8C7.45 14 7 14.45 7 15V29L11 25H21C21.55 25 22 24.55 22 24Z" fill="#979797"/>
                            </mask>
                        </svg>
                    </div>
                </a>
            </div>
        )
    }

}

export default Navigation;