import React, { Component } from 'react';
import '../../styles/component-styles/UserForm.css';
import MerchantForm from './MasterForm';
import { Redirect } from 'react-router-dom';

class FormController extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      form_num: 1,
      redirectToOutput: false
    };
  }
  completedForm(e){
    if(e==='success'){
      this.setState({ redirectToOutput: true });
    }
  }

  navi(e){
    switch(e.target.value){
      case 'merchant':
        this.setState({form_num: 1});
        break;
      default:
        this.setState({form_num: 1});
        break;
    }
  }
  redir(e){
    this.setState({form_num: 1});
  }

  //I want to be able to change merchantSuccess inside of MerchantForm, CategoryForm etc
  //And have it retain it's value across the forms so the formcontroller can identify which one to render
  render() {
    if (this.state.redirectToOutput) {
      return <Redirect to="/output" />;
    }

    return (
      <div>
        <MerchantForm isFinished={this.completedForm.bind(this)} />
      </div>
    );
  }
}
export default FormController;
