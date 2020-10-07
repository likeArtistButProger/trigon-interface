import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import BuyComponent from './components/pages/BuyComponent';

import Main from './components/pages/Main';
import ReferalsComponent from './components/pages/ReferalsComponent';
import SellComponent from './components/pages/SellComponent';
import SendComponent from './components/pages/SendComponent';
import Transactions from './components/pages/Transactions';
import Support from './components/pages/Support';

import './trigon_interface/interface';

import './styles/app.css';


function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/wallet/" component={Main}/>
        <Route exact path="/wallet/buy" component={BuyComponent}/>
        <Route exact path="/wallet/sell" component={SellComponent}/>
        <Route exact path="/wallet/send" component={SendComponent}/>
        <Route exact path="/wallet/txs" component={Transactions}/>
        <Route exact path="/wallet/referral" component={ReferalsComponent}/>
        <Route exact path="/wallet/faq" component={Support}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
