import React, {Component} from 'react';

import MobileNavigation from '../common/MobileNavigation.js';
import Navigation from '../common/Navigation.js';
import MainContent from './MainContent.js';

class Main extends Component {

    render() {
        return (
            <div>
                <MobileNavigation />
                <div className="flex flex-row">
                    <Navigation active_tab={0}/>    
                    <MainContent />
                </div>
            </div>
        )
    }
}


export default Main;