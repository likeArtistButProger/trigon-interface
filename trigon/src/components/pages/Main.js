import React, {Component} from 'react';

import MobileNavigation from '../common/MobileNavigation';
import Navigation from '../common/Navigation';
import MainContent from './MainContent';

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