import React, {Component} from 'react';

import MobileNavigation from '../common/MobileNavigation';
import Navigation from '../common/Navigation';
import SellContent from '../pages/SellContent';

class SellComponent extends Component {

    render() {
        return(
            <div>
                <MobileNavigation />
                <div className="flex flex-row">
                    <Navigation active_tab={2}/>
                    <SellContent />
                </div>
            </div>
        );
    }
}

export default SellComponent;