import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import Input from '../pages/Input';
import Output from '../pages/Output';
import '../../styles/component-styles/NavBar.css';
import { Navbar } from 'react-materialize';

class NavBar extends Component {
  render() {
    return (
      <div>
        <Navbar
          brand={<span className="brand-title">ExpenseFlow</span>}
          left
          className="navbar modern-navbar"
        >
          <li><Link className="link" to="/">Input</Link></li>
          <li><Link className="link" to="/output">Output</Link></li>
        </Navbar>
        <div className="page-content">
          <Route exact path="/" component={Input}/>
          <Route exact path="/output" component={Output}/>
        </div>
      </div>
    );
  }
}

export default NavBar;
