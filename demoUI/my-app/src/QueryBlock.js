import React, { Component } from 'react';
import 'whatwg-fetch';
import './Menu.css';
import * as common from './common.js';


export class QueryBlock extends Component {
  constructor(props) {
      super(props);
      this.state = {
        queryResult:'',
        channelData:{},
        channelName: '',
        checkedPeer:[],
        blockNum:""
      };
      var org = localStorage.getItem("org");
      this.handleChange = this.handleChange.bind(this);
      this.handleRadioChange = this.handleRadioChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    var token = localStorage.getItem('token');
    var userName = localStorage.getItem('userName');

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
    this.setState({blockNum: event.target.value});
  }

  handleRadioChange(event){
      var value = event.target.value;
      switch(event.target.name){
          case "peer":
              this.setState((prevState,props)=>({
                    checkedPeer: [value]
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
      var token = localStorage.getItem('token');
      var org = localStorage.getItem('org');
      var peer = null;
      switch(org){
        case "org1":
          if (this.state.checkedPeer[0] == "localhost:7051") peer = "peer1";
          else peer = "peer2";
          break;
        case "org2":
          if (this.state.checkedPeer[0] == "localhost:8051") peer = "peer3";
          else peer = "peer4";
          break;
      }
      var url = 'http://localhost:4000/channels/mychannel/blocks/'
               + this.state.blockNum +
               '?peer=' + peer;

      console.log(url);
      fetch(url, {
        method: 'GET',
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'authorization': 'Bearer '+ token,
          'x-access-token': token
        },
      }).then(common.checkStatus)
        .then(common.parseText)
        .then((data) => {
        console.log(data);
        this.setState({queryResult:data});
        alert("Query block successfully!");
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
    if (this.state.queryResult){
        queryR = (<div className="queryResult">
                     <span>Query Result: </span>
                     <span>{this.state.queryResult}</span>
                   </div>);
    }
    return (
    <div>
      <div className="right-panel-head">
          <h2>Query Block</h2>
      </div>
      <form className="CCh-form" onSubmit={this.handleSubmit}>
          <fieldset>
            <legend>Choose the existing channel to query block on</legend>
            <div onChange={this.handleRadioChange}>
              {channelData}
            </div>
          </fieldset>
          <fieldset>
            <legend>Choose the peer to query block on</legend>
            <div onChange={this.handleRadioChange}>
              {peerData}
            </div>
          </fieldset>
          <fieldset>
             <legend>Query Parameters</legend>
             <div className="form-ques">
               <span>Block Num:</span>
               <input type="text" name="blockNum" value={this.state.blockNum} onChange={this.handleChange}/>
             </div>
           </fieldset>
       <input type="submit" value="Submit" />
       {queryR}
      </form>
    </div>
    );
  }
}