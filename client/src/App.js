import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import Navigator from './components/Navigator';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Home from './components/smart/Home';
import Login from './components/smart/Login';
import Registration from './components/smart/Registration';
import Profile from './components/smart/Profile';
import RecoverWallet from './components/smart/RecoverWallet';
import GenerateWallet from './components/smart/GenerateWallet';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navigator />
          <Route exact path="/" component={Home} />
          <PublicRoute path="/login" component={Login} />
          <PublicRoute path="/register" component={Registration} />
          <PublicRoute path="/generate-wallet" component={GenerateWallet} />
          <PublicRoute path="/recover-wallet" component={RecoverWallet} />
          <PrivateRoute path="/profile" component={Profile} />
        </div>
      </Router>
    );
  }
}

export default App;
