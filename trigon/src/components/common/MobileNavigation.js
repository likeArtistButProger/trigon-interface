import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import TopBar from './TopBar.js';

const MenuBtn = styled.div`
    cursor: pointer;

    & div {
        width: 100%;
        height: 3px;
        border-radius: 4px;
        background-color: white;
        margin: 6px 0;
    }
`;

class MobileNavigaition extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show_modal: false
        }
    }

    switchModal = () => {
        if(!this.state.show_modal) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = "auto";
        }

        this.setState({
            show_modal: !this.state.show_modal
        })
    }

    render() {
        return (
            <Fragment>
                <div className="md:hidden w-full grid grid-cols-6">
                    {
                        this.state.show_modal &&
                        <div id="navList" className="absolute top-0 left-0 w-full h-full bg-trigon_gray-200 flex flex-col z-10">
                            <span className="absolute flex flex-row top-0 ml-3">
                                <TopBar />
                            </span>
                            <span className="absolute top-0 right-0 mr-3 mt-3 text-3xl" onClick={this.switchModal}>X</span>
                            <ul className="mt-20 text-center">
                                <li className="my-8 text-2xl">
                                    <a href="/wallet/">Dashboard</a>
                                </li>
                                <li className="my-8 text-2xl">
                                    <a href="/wallet/buy">Buy TRGN</a>
                                </li>
                                <li className="my-8 text-2xl">
                                    <a href="/wallet/sell">Sell TRGN</a>
                                </li>
                                <li className="my-8 text-2xl">
                                    <a href="/wallet/send">Send TRGN</a>
                                </li>
                                <li className="my-8 text-2xl">
                                    <a href="/wallet/txs">Transactions</a>
                                </li>
                                <li className="my-8 text-2xl">
                                    <a href="/wallet/referral">Referrals</a>
                                </li>
                                <li className="my-8 text-2xl">
                                    <a href="/wallet/faq">FAQ</a>
                                </li>
                                <li className="mt-12">
                                    <div id="social" className="w-2/3 mx-auto my-auto pl-4 grid grid-cols-4 gap-2">
                                        <div>
                                            <a className="text-center" onClick={() => window.open('https://t.me/trigonplus')}>
                                                <svg id="telegram" className="pl-1 mx-auto" fill="#979797" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" space="preserve" serif="http://www.serif.com/" style={{fillRule: 'evenodd', clipRule: 'evenodd', strokelineJoin: 'round', strokeMiterlimit: '1.41421', marginLeft: "1.6rem"}}><path id="telegram-1" d="M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z"/></svg>
                                            </a>
                                        </div>
                                        <div>
                                            <a onClick={() => window.open("https://www.facebook.com/Trigon-Token-105600677960781")}>
                                                <svg id="facebook" className="mx-auto" fill="#979797" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                                            </a>
                                        </div>
                                        <div>
                                            <a onClick={() => window.open("https://twitter.com/Trigon73662296")}>
                                                <svg id="twitter" className="mx-auto" fill="#979797" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                            </a>
                                        </div>
                                        <div>
                                            <a onClick={() => window.open('https://www.youtube.com/channel/UCTlQ88_jXaa1D5AwKIhtyCQ')}>
                                                <svg id="youtube" className="mx-auto" fill="#979797" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M4.652 0h1.44l.988 3.702.916-3.702h1.454l-1.665 5.505v3.757h-1.431v-3.757l-1.702-5.505zm6.594 2.373c-1.119 0-1.861.74-1.861 1.835v3.349c0 1.204.629 1.831 1.861 1.831 1.022 0 1.826-.683 1.826-1.831v-3.349c0-1.069-.797-1.835-1.826-1.835zm.531 5.127c0 .372-.19.646-.532.646-.351 0-.554-.287-.554-.646v-3.179c0-.374.172-.651.529-.651.39 0 .557.269.557.651v3.179zm4.729-5.07v5.186c-.155.194-.5.512-.747.512-.271 0-.338-.186-.338-.46v-5.238h-1.27v5.71c0 .675.206 1.22.887 1.22.384 0 .918-.2 1.468-.853v.754h1.27v-6.831h-1.27zm2.203 13.858c-.448 0-.541.315-.541.763v.659h1.069v-.66c.001-.44-.092-.762-.528-.762zm-4.703.04c-.084.043-.167.109-.25.198v4.055c.099.106.194.182.287.229.197.1.485.107.619-.067.07-.092.105-.241.105-.449v-3.359c0-.22-.043-.386-.129-.5-.147-.193-.42-.214-.632-.107zm4.827-5.195c-2.604-.177-11.066-.177-13.666 0-2.814.192-3.146 1.892-3.167 6.367.021 4.467.35 6.175 3.167 6.367 2.6.177 11.062.177 13.666 0 2.814-.192 3.146-1.893 3.167-6.367-.021-4.467-.35-6.175-3.167-6.367zm-12.324 10.686h-1.363v-7.54h-1.41v-1.28h4.182v1.28h-1.41v7.54zm4.846 0h-1.21v-.718c-.223.265-.455.467-.696.605-.652.374-1.547.365-1.547-.955v-5.438h1.209v4.988c0 .262.063.438.322.438.236 0 .564-.303.711-.487v-4.939h1.21v6.506zm4.657-1.348c0 .805-.301 1.431-1.106 1.431-.443 0-.812-.162-1.149-.583v.5h-1.221v-8.82h1.221v2.84c.273-.333.644-.608 1.076-.608.886 0 1.18.749 1.18 1.631v3.609zm4.471-1.752h-2.314v1.228c0 .488.042.91.528.91.511 0 .541-.344.541-.91v-.452h1.245v.489c0 1.253-.538 2.013-1.813 2.013-1.155 0-1.746-.842-1.746-2.013v-2.921c0-1.129.746-1.914 1.837-1.914 1.161 0 1.721.738 1.721 1.914v1.656z"/></svg>
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                        </div>
                    }

                    <div className="w-8 h-8 mt-2 ml-2 col-start-1">
                        <a href="http://trigon.plus/">
                            <img src='logo.png' alt=""/>
                        </a>
                    </div>
                    <div className="flex justify-end mr-3 flex-row col-start-6">

                        <MenuBtn className="mt-3 w-6 h-6" onClick={this.switchModal}>
                            <div className=""></div>
                            <div className=""></div>
                            <div className=""></div>
                        </MenuBtn>
                    </div>
                </div>
            </Fragment>
        )
    }
}


export default MobileNavigaition;