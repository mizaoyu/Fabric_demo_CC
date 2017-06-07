import React, { Component } from 'react';
import 'whatwg-fetch';
import './Menu.css';
import * as common from './common.js';


export class CreateChannel extends Component {
  constructor(props) {
      super(props);
      this.state = {channelConfigPath: ''};

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
      this.setState({channelConfigPath: event.target.value});
  }

  handleSubmit(event) {
      var data = {
         channelName:"mychannel",
         channelConfigPath:this.state.channelConfigPath
      };

      var token = localStorage.getItem('token');

      fetch('http://localhost:4000/channels', {
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
            alert("Create Channel mychannel successfully!");
            window.location = "/menu/joinCh";
        }
      }).catch(function(error) {
        console.log('request failed', error);
        alert(error);
      });
      event.preventDefault();
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    return (
    <div>
      <div className="right-panel-head">
          <h2>Create Channel</h2>
      </div>
      <form className="CCh-form" onSubmit={this.handleSubmit}>
          <label>
            <span>Channel Config File Path:</span>
            <input type="text" name="channelConfigPath" value={this.state.channelConfigPath} onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Submit" />
      </form>
    </div>
    );
  }
}
