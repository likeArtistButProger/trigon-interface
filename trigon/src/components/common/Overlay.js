import React, { Component } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import '../../styles/overlay.css';

class Overlay extends Component {
    render() {
        return (
            <div style={{backgroundColor: "rgba(0, 0, 0, 0.3)", zIndex: '2'}} className="absolute top-0 left-0 w-screen h-screen">
                <div id="loader">
                    <p className="mb-2">Transaction processing</p>
                    <ClipLoader
                        size={150}
                        color={'#7AC231'}
                    
                    />
                </div>
            </div>
        );
    }
}

export default Overlay;
