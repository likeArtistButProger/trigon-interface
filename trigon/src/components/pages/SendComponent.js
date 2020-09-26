import React, {Component} from 'react';

import MobileNavigation from '../common/MobileNavigation';
import Navigation from '../common/Navigation';

import SendContent from '../pages/SendContent';

class SendComponent extends Component {

    render() {
        return(
            <div>
                <MobileNavigation />
                <div className="flex flex-row">
                    <Navigation active_tab={3}/>
                    <SendContent />
                </div>
            </div>
        );
    }
}

export default SendComponent;