import React, {Component} from 'react';

import MobileNavigation from '../common/MobileNavigation';
import Navigation from '../common/Navigation';

import ReferalsContent from './ReferalsContent';

class ReferalsComponent extends Component {

    render() {
        return(
            <div>
                <MobileNavigation />
                <div className="flex flex-row">
                    <Navigation active_tab={4}/>
                    <ReferalsContent />
                </div>
            </div>
        );
    }
}

export default ReferalsComponent;