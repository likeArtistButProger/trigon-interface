import React, {Component} from 'react';

import Navigation from '../common/Navigation.js';
import MobileNavigation from '../common/MobileNavigation.js';
import BuyContent from './BuyContent.js';

class BuyComponent extends Component {

    render() {
        return(
            <div>
                <MobileNavigation />
                <div className="flex flex-row">
                    <Navigation active_tab={1}/>
                    <BuyContent />    
                </div>
            </div>
        );
    }
}

export default BuyComponent;