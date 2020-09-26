import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import Logo from '../../assets/logo.png';

import TopBar from './TopBar';

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
                            <span className="absolute top-0 ml-3">
                                <TopBar />
                            </span>
                            <span className="absolute top-0 right-0 mr-3 mt-3 text-3xl" onClick={this.switchModal}>X</span>
                            <ul className="mt-20 text-center">
                                <li className="my-8 text-2xl">
                                    <a href="/">Dashboard</a>
                                </li>
                                <li className="my-8 text-2xl">
                                    <a href="/buy">Buy TRGN</a>
                                </li>
                                <li className="my-8 text-2xl">
                                    <a href="/sell">Sell TRGN</a>
                                </li>
                                <li className="my-8 text-2xl">
                                    <a href="/send">Send TRGN</a>
                                </li>
                                <li className="my-8 text-2xl">
                                    <a href="/referral">Referrals</a>
                                </li>
                                <li className="my-8 text-2xl">
                                    <a href="/support">Support</a>
                                </li>
                            </ul>
                        </div>
                    }

                    <div className="w-8 h-8 mt-2 ml-2 col-start-1">
                        <a href="http://trigon.plus/">
                            <img src={Logo} alt=""/>
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