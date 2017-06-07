import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { EnrollForm } from './enroll';

class App extends Component {
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to HyperLedger Demo</h2>
        </div>
        <EnrollForm />
      </div>
    );
  }
}

export default App;
