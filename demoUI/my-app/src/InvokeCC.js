import React, { Component } from 'react';
import 'whatwg-fetch';
import './Menu.css';
import * as common from './common.js';


export class InvokeCC extends Component {
  constructor(props) {
      super(props);
      this.state = {
        CCdata:{},
        entityNames:[],
        channelData:{},
        checkedCC: {},
        channelName: '',
        checkedPeer:[],
        args:[],
        tId:''
      };
      var org = localStorage.getItem("org");
      this.handleChange = this.handleChange.bind(this);
      this.handleRadioChange = this.handleRadioChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      var entityNum = 2;
      for (var i=0; i<entityNum*2;i++){
        this.state.args.push("");
      }
  }

  componentDidMount() {
    var token = localStorage.getItem('token');
    var userName = localStorage.getItem('userName');
    fetch('http://localhost:4000/getChaincode', {
        method: 'GET',
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'authorization': 'Bearer '+ token,
          'x-access-token': token
        }
      }).then(common.checkStatus)
        .then(common.parseJSON)
        .then((data) => {
        if (!data.success){
            alert(data.message);
        }else{
            console.log(data);
            this.setState({ CCdata: JSON.parse(data.message) });
        }
      }).catch(function(error) {
        console.log('request failed', error);
        alert(error);
      });

    fetch('http://localhost:4000/getEntitys', {
        method: 'GET',
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'authorization': 'Bearer '+ token,
          'x-access-token': token
        }
      }).then(common.checkStatus)
        .then(common.parseJSON)
        .then((data) => {
        if (!data.success){
            alert(data.message);
        }else{
            console.log(data);
            this.setState({ entityNames: JSON.parse(data.message) });
        }
      }).catch(function(error) {
        console.log('request failed', error);
        alert(error);
      });

      fetch('http://localhost:4000/addchannel?username='+userName, {
          method: 'GET',
          headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'authorization': 'Bearer '+ token,
            'x-access-token': token
          }
        }).then(common.checkStatus)
          .then(common.parseJSON)
          .then((data) => {
          if (!data.success){
              alert(data.message);
          }else{
              console.log(data);
              this.setState({ channelData: JSON.parse(data.message) });
          }
        }).catch(function(error) {
          console.log('request failed', error);
          alert(error);
        });
  }

  handleChange(event){
    var args = this.state.args;
    switch(event.target.name){
        case "fromName":
            args[1] = event.target.value;
            break;
        case "toName":
            args[2] = event.target.value;
            break;
        case "amount":
            args[3] = event.target.value;
            break;
    }
    this.setState({args: args});
  }

  handleRadioChange(event){
      var value = event.target.value;
      switch(event.target.name){
          case "peer":
              this.setState((prevState,props)=>({
                    checkedPeer: [value]
                }));
              break;
          case "cc":
              this.setState((prevState,props)=>({
                  checkedCC: JSON.parse(value)
              }));
              break;
          case "channel":
              this.setState((prevState,props)=>({
                  channelName: value
              }));
              break;
      }
  }

  handleSubmit(event) {
      this.state.args[0] = "move";
      var data = {
        peers:this.state.checkedPeer,
        chaincodeVersion:this.state.checkedCC.chaincodeVersion,
        functionName:"invoke",
        args:this.state.args
      };
      console.log(data);
      console.log(this.state.checkedCC.chaincodeName);
      var token = localStorage.getItem('token');

      fetch('http://localhost:4000/channels/mychannel/chaincodes/' + this.state.checkedCC.chaincodeName, {
        method: 'POST',
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'authorization': 'Bearer '+ token,
          'x-access-token': token
        },
        body: JSON.stringify(data)
      }).then(common.checkStatus)
        .then(common.parseText)
        .then((data) => {
        this.setState({tId: data});
        alert("Invoke chaincode successfully!");
      }).catch(function(error) {
        console.log('request failed', error);
        alert(error);
      });
      event.preventDefault();
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    var org = localStorage.getItem("org");

    var channelData = Object.keys(this.state.channelData).map((people,index)=>{
        var channels = this.state.channelData[people];
        return channels.map(function(channel){
            return (
            <div className="ui-radio on" data-radio="group">
                <input className="input-hidden" type="radio" name="channel" value={channel}></input>
                <span className="radio-text">{channel}</span>
            </div>
            );
        });
    });

    var ccData = Object.keys(this.state.CCdata).map((peer,index)=>{
        if (this.state.checkedPeer.length > 0){
            var checkedPeer = this.state.checkedPeer[0];
            if (peer == checkedPeer){
                var ccList = this.state.CCdata[peer];
                return Object.keys(ccList).map((ccName,index)=>{
                       var cc = ccList[ccName];
                       console.log(cc);
                       var ccJson = JSON.stringify(cc);
                       return (
                       <div className="ui-radio on" data-radio="group">
                           <input className="input-hidden" type="radio" name="cc" value={ccJson}></input>
                           <span className="radio-text">{cc.chaincodeName}</span>
                       </div>
                       );
                });
            }
        }


    });

    var peerData = null;
    if (org == "org1"){
            peerData = (
                <div>
                    <div className="ui-checkbox on">
                      <input className="input-hidden" type="radio" name="peer" value="localhost:7051"></input>
                      <span className="checkbox-text">peer1 (from Org1) : localhost:7051</span>
                    </div>
                    <div className="ui-checkbox on">
                      <input className="input-hidden" type="radio" name="peer" value="localhost:7056"></input>
                      <span className="checkbox-text">peer2 (from Org1) : localhost:7056</span>
                    </div>
                </div>
              );
        }else{
            peerData = (
                <div>
                    <div className="ui-checkbox on">
                      <input className="input-hidden" type="radio" name="peer" value="localhost:8051"></input>
                      <span className="checkbox-text">peer3 (from Org2) : localhost:8051</span>
                    </div>
                    <div className="ui-checkbox on">
                      <input className="input-hidden" type="radio" name="peer" value="localhost:8056"></input>
                      <span className="checkbox-text">peer4 (from Org2) : localhost:8056</span>
                    </div>
                </div>
              );
        }

    var queryR = null;
    if (this.state.tId){
        queryR = (<div className="queryResult">
                     <span>Transaction Id: </span>
                     <span>{this.state.tId}</span>
                   </div>);
    }
    return (
    <div>
      <div className="right-panel-head">
          <h2>Invoke Chaincode</h2>
      </div>
      <form className="CCh-form" onSubmit={this.handleSubmit}>
          <fieldset>
            <legend>Choose the existing channel to invoke chaincode on</legend>
            <div onChange={this.handleRadioChange}>
              {channelData}
            </div>
          </fieldset>
          <fieldset>
            <legend>Choose the peer to invoke chaincode on</legend>
            <div onChange={this.handleRadioChange}>
              {peerData}
            </div>
          </fieldset>
          <fieldset>
            <legend>Choose the existing chaincode on peer {this.state.checkedPeer[0]} to invoke</legend>
            <div onChange={this.handleRadioChange}>
              {ccData}
            </div>
          </fieldset>

          <fieldset>
             <legend>Asset Movement</legend>
             <div className="form-ques">
               <span>From Entity:</span>
               <input type="text" name="fromName" value={this.state.args[1]} onChange={this.handleChange}/>
               <span>To Entity:</span>
               <input type="text" name="toName" value={this.state.args[2]} onChange={this.handleChange}/>
             </div>
             <div className="form-ques">
                <span>Amount:</span>
                <input type="text" name="amount" value={this.state.args[3]} onChange={this.handleChange}/>
              </div>
           </fieldset>
       <input type="submit" value="Submit" />
       {queryR}
      </form>
    </div>
    );
  }
}