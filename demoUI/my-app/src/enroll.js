import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  BrowserRouter as Router,
  Route,
  Link,
  MemoryRouter
} from 'react-router-dom';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import * as common from './common.js';

export class EnrollForm extends React.Component {
  constructor(props) {
      super(props);
      this.state = {userName: '',org: 'org1',visible: false};

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.rodalShow = this.rodalShow.bind(this);
      this.rodalHide = this.rodalHide.bind(this);
  }

  rodalShow() {
      this.setState({ visible: true });
  }

  rodalHide() {
      this.setState({ visible: false });
      window.location = "/menu";
  }

  handleChange(event) {
    switch(event.target.name){
        case "userName":
            this.setState({userName: event.target.value});
            break;
        case "organization":
            this.setState({org: event.target.value});
            break;
    }
  }

  handleSubmit(event) {
      console.log(this.state);
      //alert('A name was submitted: ' + this.state.value);
      var data = "username="+this.state.userName +"&orgName=" + this.state.org;
      /*var data = {
          username: this.state.userName,
          orgName: this.state.org,
      }*/
      // Submit form via jQuery/AJAX

      fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {
          //'Content-Type': 'application/json',
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: data
        //body:JSON.stringify(data)
      }).then(common.checkStatus)
        .then(common.parseJSON)
        .then((data) => {
        console.log(data);
        if (!data.success){
            alert(data.message);
        }else{
            this.rodalShow();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', this.state.userName);
            localStorage.setItem('org', this.state.org);
        }
      }).catch(function(error) {
        console.log('request failed', error);
        alert(error);
      });
      event.preventDefault();
  }

  render() {
    return (
    <div>
      <form className="enrollForm" onSubmit={this.handleSubmit}>
        <div className="enrollTitle"> Login </div>
        <label>
          <span>User Name:</span>
          <input type="text" name="userName" value={this.state.userName} onChange={this.handleChange}/>
        </label>
        <label>
          <span>Organization:</span>
          <select name="organization" value={this.state.org} onChange={this.handleChange}>
            <option value="org1">Org1</option>
            <option value="org2">Org2</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
      <Rodal visible={this.state.visible} onClose={this.rodalHide}>
        <div className="rodal-message">Enroll successfully!</div>
      </Rodal>
    </div>
    );
  }
}

