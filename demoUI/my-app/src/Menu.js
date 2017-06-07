import React, { Component } from 'react';
import './Menu.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {CreateChannel} from './CreateChannel';
import {JoinChannel} from './JoinChannel';
import {InstallChaincode} from './InstallChaincode';
import {InstantiateCC} from './InstantiateCC';

class Menu extends Component {
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    var token = localStorage.getItem('token');
    var userName = localStorage.getItem('userName');
    var org = localStorage.getItem('org');
    return (
      <div className="Menu-wrapper">
        <div className="side-bar">
          <div className="sidebar-title">Functions</div>
          <Link to="/menu/createCh" className="sidebar-content">Create Channel</Link>
          <Link to="/menu/joinCh" className="sidebar-content">Join Channel</Link>
          <Link to="/menu/installCC" className="sidebar-content">Install Chaincode</Link>
          <Link to="/menu/instantiateCC" className="sidebar-content">Instantiate Chaincode</Link>
          <Link to="/menu/invokeCC" className="sidebar-content">Invoke Chaincode</Link>
          <Link to="/menu/queryCC" className="sidebar-content">Query Chaincode</Link>
          <Link to="/menu/queryBlock" className="sidebar-content">Query Block</Link>
          <Link to="/menu/queryTrans" className="sidebar-content">Query Transaction</Link>
          <div className="sidebar-info">Hi, {userName} from {org}</div>
          <div className="sidebar-info">Token: {token}</div>
        </div>
        <div className="right-panel">
            <Route path="/menu/createCh" component={CreateChannel}/>
            <Route path="/menu/joinCh" component={JoinChannel}/>
            <Route path="/menu/installCC" component={InstallChaincode}/>
            <Route path="/menu/instantiateCC" component={InstantiateCC}/>
        </div>
      </div>

    );
  }
}

export default Menu;