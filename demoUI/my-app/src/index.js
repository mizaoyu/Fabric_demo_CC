import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Menu from './Menu';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

ReactDOM.render((
 <Router>
    <div>
      <Route path="/login" component={App}/>
      <Route path="/menu" component={Menu}/>
    </div>
 </Router>
), document.getElementById('root'));
registerServiceWorker();
