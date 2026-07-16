import React, { Component } from 'react';
// import { Input, Button, Icon } from 'react-materialize';
import { Input,Button } from 'react-materialize';
import { Icon } from 'react-materialize'
import '../../styles/component-styles/UserForm.css';

class MerchantForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      storeName: '',
      shopKeeperName: '',
      storePhone: '',
      city: '',
      st: '',
      street: '',
      zipCode: '',
      zip: '', 
      category: '',
      amount: '',
      date: '',
      productName: '',
      noOfUnits: '',
      status: '',
      isSubmitting: false,
      error: ''
    }
  }
  
  handleChange(event){
    this.setState({ [event.target.name]: event.target.value });
  }

  handleMerchant(event){
    event.preventDefault();

    const missing = [];
    if (!this.state.storeName.trim()) missing.push('Store Name');
    if (!this.state.category.trim()) missing.push('Product');
    if (!this.state.amount.trim()) missing.push('Amount');
    if (!this.state.date.trim()) missing.push('Date');
    if (!this.state.productName.trim()) missing.push('Transaction Type');

    if (missing.length > 0) {
      this.setState({
        error: 'Please fill required fields: ' + missing.join(', '),
        status: 'error',
        isSubmitting: false
      });
      return;
    }

    this.setState({ isSubmitting: true, error: '', status: '' });

    const form = JSON.stringify({
      merchant: {
    store_name: this.state.storeName,
    store_address: this.state.street,
    store_phone: this.state.storePhone,
    zipcode: this.state.zip,
    city: this.state.city,
    state: this.state.st
},
     location: {
    zipcode: this.state.zip,
    city: this.state.city,
    state: this.state.st
},
      category: {
        name: this.state.category
      },
      transaction: {
        amount: this.state.amount,
        date: this.state.date
      },
      product: {
        name: this.state.productName,
         
      }
    });

   fetch('http://localhost:3001/api/createAll', {
      method: 'POST',
      body: form,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message || 'Server could not save your entry.');
        }
        return data;
      })
      .then(res => {
        if (res && res.product && res.product.id) {
          this.setState({ status: 'success', isSubmitting: false });
          this.props.isFinished('success');
        } else {
          throw new Error('Save failed. Please fill all fields and use date format YYYY-MM-DD.');
        }
      })
      .catch(err => {
        this.setState({
          error: err.message,
          isSubmitting: false,
          status: 'error'
        });
      });
  }

render() {
  return (
//     <form onSubmit={this.handleMerchant.bind(this)}>
//       <div className="inputForm">

//         <h5>Merchant Information</h5>

//         <Input
//           label="Store Name"
//           name="storeName"
//           type="text"
//           value={this.state.storeName}
//           onChange={this.handleChange.bind(this)}
//         />

//         <Input
//           label="Shopkeeper Name"
//           name="shopKeeperName"
//           type="text"
//           value={this.state.shopKeeperName}
//           onChange={this.handleChange.bind(this)}
//         />

//         <Input
//           label="Store Phone Number"
//           name="storePhone"
//           type="text"
//           value={this.state.storePhone}
//           onChange={this.handleChange.bind(this)}
//         />

//         <h5>Location Information</h5>

//         <Input
//           label="Street"
//           name="street"
//           type="text"
//           value={this.state.street}
//           onChange={this.handleChange.bind(this)}
//         />

//         <Input
//           label="City"
//           name="city"
//           type="text"
//           value={this.state.city}
//           onChange={this.handleChange.bind(this)}
//         />

//         <Input
//           label="State"
//           name="st"
//           type="text"
//           value={this.state.st}
//           onChange={this.handleChange.bind(this)}
//         />
        
// <Input
//     label="Zip Code"
//     name="zip"
//     type="text"
//     value={this.state.zip}
//     onChange={this.handleChange.bind(this)}
// />

//         <h5>Product Information</h5>

//         <Input
//           label="Product Category"
//           name="category"
//           type="text"
//           value={this.state.category}
//           onChange={this.handleChange.bind(this)}
//         />

//         <Input
//           label="Product Name"
//           name="productName"
//           type="text"
//           value={this.state.productName}
//           onChange={this.handleChange.bind(this)}
//         />

//         <Input
//           label="Number of Units"
//           name="noOfUnits"
//           type="number"
//           value={this.state.noOfUnits}
//           onChange={this.handleChange.bind(this)}
//         />

//         <h5>Transaction Information</h5>

//         <Input
//           label="Amount"
//           name="amount"
//           type="number"
//           value={this.state.amount}
//           onChange={this.handleChange.bind(this)}
//         />

//         <div className="input-field">
//           <label className="active">Date</label>
//           <input
//             type="date"
//             name="date"
//             className="browser-default"
//             value={this.state.date}
//             onChange={this.handleChange.bind(this)}
//           />
//         </div>

//         {this.state.error && (
//           <p style={{ color: "red" }}>{this.state.error}</p>
//         )}

//         {this.state.status === "success" && (
//           <p style={{ color: "green" }}>Saved Successfully!</p>
//         )}

//         <Button
//           type="submit"
//           disabled={this.state.isSubmitting}
//         >
//           {this.state.isSubmitting ? "Saving..." : "Submit"}
//         </Button>

//       </div>
//     </form>
//   );
// }
      <form onSubmit={this.handleMerchant.bind(this)}>
        <div className="inputForm">    

          <br></br>
          <h6>Merchant Info</h6>
          <br></br>
          <Input label="Store Name" name="storeName" type="text" value={this.state.storeName} onChange={this.handleChange.bind(this)} />
          <Input label="Shopkeeper Name" name="shopKeeperName" type="text" value={this.state.shopKeeperName} onChange={this.handleChange.bind(this)} />
          <Input label="Store Phone Number" name="storePhone" type="text" value={this.state.storePhone} onChange={this.handleChange.bind(this)} />
          
          <br></br>
          <h6>Location Info</h6>
          <br></br>
          <div className="location"> 
            <Input label="Street" name="street" type="text" value={this.state.street} onChange={this.handleChange.bind(this)} />
            <Input label="City" name="city" type="text" value={this.state.city} onChange={this.handleChange.bind(this)} />
            <Input label="State" name="st" data-length={2} type="text" value={this.state.st} onChange={this.handleChange.bind(this)} />
          </div>
          <Input
    label="Zip Code"
    name="zip"
    type="text"
    value={this.state.zip}
    onChange={this.handleChange.bind(this)}
/>

          <br></br>
          <h6>Product Info</h6>
          <br></br>
          <Input label="Product" name="category" type="text" value={this.state.category} onChange={this.handleChange.bind(this)} />
          <Input label="No. of Units" name="noOfUnits" type="number" min="1" value={this.state.noOfUnits} onChange={this.handleChange.bind(this)} />

          <br></br>
          <h6>Transaction Info</h6>
          <br></br>
          <Input label="Amount" name="amount" type="number" step="0.01" value={this.state.amount} onChange={this.handleChange.bind(this)} required />
          <div className="input-field">
            <input
              id="transaction-date"
              name="date"
              type="date"
              className="browser-default"
              value={this.state.date}
              onChange={this.handleChange.bind(this)}
              required
            />
            <label htmlFor="transaction-date" className="active">Date</label>
          </div>

          <Input label="Transaction Type" name="productName" type="text" value={this.state.productName} onChange={this.handleChange.bind(this)} required />

          {this.state.error ? <p className="form-error">{this.state.error}</p> : null}
          {this.state.status === 'success' ? <p className="form-success">Saved successfully. Opening report...</p> : null}
        
          <Button type="submit" waves='light' disabled={this.state.isSubmitting}>
            {this.state.isSubmitting ? 'Saving...' : 'Submit'}<Icon left>done</Icon>
          </Button>
        </div>
      </form>
    )
  }
}
export default MerchantForm;
