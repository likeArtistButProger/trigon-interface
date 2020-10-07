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
        <Route exact path="/" component={Main}/>
        <Route exact path="/buy" component={BuyComponent}/>
        <Route exact path="/sell" component={SellComponent}/>
        <Route exact path="/send" component={SendComponent}/>
        <Route exact path="/txs" component={Transactions}/>
        <Route exact path="/referral" component={ReferalsComponent}/>
        <Route exact path="/faq" component={Support}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
