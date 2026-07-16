import React, { Component } from 'react';
import FormController from '../components/FormController.js';
import "../../styles/page-styles/Input.css";

class Input extends Component {
  render() {
    return (
      <div className="Inputs app-card">
        <p className="eyebrow">Transactions</p>
        <h3>Input Transaction Information</h3>
        <p className="intro-copy">Capture each purchase in a polished, guided form so your spending stays clear and organized.</p>
        <FormController />
      </div>
    );
  }
}

export default Input;
