import React, { Component } from 'react';
import 'whatwg-fetch';
import './Menu.css';
import * as common from './common.js';


export class JoinChannel extends Component {
  constructor(props) {
      super(props);
      var org = localStorage.getItem("org");
      var checkedPeer = {};
      if (org == "org1"){
        checkedPeer["localhost:7051"] = false;
        checkedPeer["localhost:7056"] = false;
      }else{
        checkedPeer["localhost:8051"] = false;
        checkedPeer["localhost:8056"] = false;
      }
      this.state = {checkedChannel: '',checkedPeer:checkedPeer, channelData:{}};

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleRadioChange = this.handleRadioChange.bind(this);
      this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
  }

  handleRadioChange(event){
    var value = event.target.value;
    this.setState((prevState,props)=>({
        checkedChannel: value
    }));
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
      console.log(peerChecked)

      var data = {
         peers:peerChecked,
      };
      var token = localStorage.getItem('token');
      console.log(this.state.checkedChannel);
      fetch('http://localhost:4000/channels/'+this.state.checkedChannel+'/peers', {
        method: 'POST',
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'authorization': 'Bearer '+ token,
          'x-access-token': token
        },
        body: JSON.stringify(data)
      }).then(common.checkStatus)
        .then(common.parseJSON)
        .then((data) => {
        console.log(data);
        if (!data.success){
            alert(data.message);
        }else{
            alert("Join Channel '" + this.state.checkedChannel + "' successfully!");
            window.location = "/menu/installCC";
        }
      }).catch(function(error) {
        console.log('request failed', error);
        alert(error);
      });
      event.preventDefault();
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



  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    var org = localStorage.getItem("org");
    console.log(this.state.channelData);
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
          <h2>Join Channel</h2>
      </div>
      <form className="CCh-form" onSubmit={this.handleSubmit}>
          <fieldset>
            <legend>Choose the peer(s) in {org} to join channel</legend>
            {peerData}
          </fieldset>
          <fieldset>
            <legend>Choose the existing channel to join</legend>
            <div onChange={this.handleRadioChange}>
              {channelData}
            </div>
          </fieldset>
          <input type="submit" value="Submit" />
      </form>
    </div>
    );
  }
}

