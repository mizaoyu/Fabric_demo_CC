import React, { Component } from 'react';
import 'whatwg-fetch';
import './Menu.css';
import * as common from './common.js';


export class InstallChaincode extends Component {
  constructor(props) {
      super(props);
      this.state = {chaincodeName: '',chaincodePath: '',checkedPeer:{}};
      var org = localStorage.getItem("org");
      if (org == "org1"){
        this.state.checkedPeer["localhost:7051"] = false;
        this.state.checkedPeer["localhost:7056"] = false;
      }else{
        this.state.checkedPeer["localhost:8051"] = false;
        this.state.checkedPeer["localhost:8056"] = false;
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    switch(event.target.name){
        case "chaincodeName":
            this.setState({chaincodeName: event.target.value});
            break;
        case "chaincodePath":
            this.setState({chaincodePath: event.target.value});
            break;
    }
  }

  handleCheckBoxChange(event) {
      var value = event.target.value;
      var checkedPeer = this.state.checkedPeer;
      if (event.target.checked){
          checkedPeer[value] = true;
      }else{
          checkedPeer[value] = false;
      }
      this.setState((prevState,props)=>({
         checkedPeer: checkedPeer
      }));
  }

  handleSubmit(event) {
      var peerChecked = [];
      console.log(this.state.checkedPeer);
      for (var key in this.state.checkedPeer){
        console.log(key);
        if (this.state.checkedPeer[key]){
          peerChecked.push(key);
        }
      }
      console.log(peerChecked);

      var data = {
        peers:peerChecked,
        chaincodeName:this.state.chaincodeName,
        chaincodePath:this.state.chaincodePath,
        chaincodeVersion:"v0"
      };

      var token = localStorage.getItem('token');

      fetch('http://localhost:4000/chaincodes', {
        method: 'POST',
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'authorization': 'Bearer '+ token,
          'x-access-token': token
        },
        body: JSON.stringify(data)
      }).then(common.checkStatus)
        .then((data) => {
        console.log(data);
        alert("Intall chaincode " + this.state.chaincodeName + " successfully!");
        window.location = "/menu/instantiateCC";
      }).catch(function(error) {
        console.log('request failed', error);
        alert(error);
      });
      event.preventDefault();
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    var org = localStorage.getItem("org");
    var peerData = null;
    if (org == "org1"){
            peerData = (
                <div onChange={this.handleCheckBoxChange}>
                    <div className="ui-checkbox on">
                      <input className="input-hidden" type="checkbox" name="peer" value="localhost:7051"></input>
                      <span className="checkbox-text">peer1 (from Org1) : localhost:7051</span>
                    </div>
                    <div className="ui-checkbox on">
                      <input className="input-hidden" type="checkbox" name="peer" value="localhost:7056"></input>
                      <span className="checkbox-text">peer2 (from Org1) : localhost:7056</span>
                    </div>
                </div>
              );
        }else{
            peerData = (
                <div onChange={this.handleCheckBoxChange}>
                    <div className="ui-checkbox on">
                      <input className="input-hidden" type="checkbox" name="peer" value="localhost:8051"></input>
                      <span className="checkbox-text">peer3 (from Org2) : localhost:8051</span>
                    </div>
                    <div className="ui-checkbox on">
                      <input className="input-hidden" type="checkbox" name="peer" value="localhost:8056"></input>
                      <span className="checkbox-text">peer4 (from Org2) : localhost:8056</span>
                    </div>
                </div>
              );
        }
    return (
    <div>
      <div className="right-panel-head">
          <h2>Install Chaincode</h2>
      </div>
      <form className="CCh-form" onSubmit={this.handleSubmit}>
          <div className="form-ques">
            <div>Choose peer(s) from {org} to intall chaincode on </div>
            {peerData}
          </div>
          <div className="form-ques">
            <span>Chaincode Name</span>
            <input type="text" name="chaincodeName" value={this.state.chaincodeName} onChange={this.handleChange}/>
          </div>
          <div className="form-ques">
            <span>Chaincode Path</span>
            <input type="text" name="chaincodePath" value={this.state.chaincodePath} onChange={this.handleChange}/>
          </div>

          <input type="submit" value="Submit" />
      </form>
    </div>
    );
  }
}

