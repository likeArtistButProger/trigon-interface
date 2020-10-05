import React, {Component} from 'react';

import MobileNavigation from '../common/MobileNavigation';
import Navigation from '../common/Navigation';

import TransactionContent from './TransactionContent';

class Tranastions extends Component {

    render() {
        return(
            <div>
                <MobileNavigation />
                <div className="flex flex-row">
                    <Navigation active_tab={6}/>
                    <TransactionContent />
                </div>
            </div>
        );
    }
}

export default Tranastions;