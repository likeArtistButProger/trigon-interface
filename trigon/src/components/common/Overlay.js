import React, { Component } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import '../../styles/overlay.css';

class Overlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            linkIsBuy: window.location.pathname === '/wallet/buy' ? true : false
        }
    }

    render() {
        return (
            <div style={{backgroundColor: "rgba(0, 0, 0, 0.3)", zIndex: '2'}} className="absolute top-0 left-0 w-screen h-screen">
                <div id="loader">
                    <p className="mb-2 text-xl text-center">Waiting Confirmation</p>
                    <div style={{width: 'fit-content', margin: '0 auto'}}>
                        <ClipLoader
                            size={150}
                            color={'#7AC231'}
                        />
                    </div>
                    {   
                        this.state.linkIsBuy &&
                        <p style={{color: "#e6a800"}} className="mt-1 text-sm text-center font-trigon_regular">Note: Token price may change while your transaction is not completed.</p>
                    }
                </div>
            </div>
        );
    }
}

export default Overlay;
