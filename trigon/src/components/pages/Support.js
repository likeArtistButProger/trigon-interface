import React, {Component} from 'react';

import MobileNavigation from '../common/MobileNavigation';
import Navigation from '../common/Navigation';

import SupportContent from './SupportContent';

class Support extends Component {

    render() {
        return(
            <div>
                <MobileNavigation />
                <div className="flex flex-row">
                    <Navigation active_tab={5}/>
                    <SupportContent />
                </div>
            </div>
        );
    }
}

export default Support;