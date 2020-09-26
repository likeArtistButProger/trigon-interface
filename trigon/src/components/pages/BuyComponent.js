import React, {Component} from 'react';

import Navigation from '../common/Navigation';
import MobileNavigation from '../common/MobileNavigation';
import BuyContent from './BuyContent';

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