import React, { Component } from 'react';
import { Button } from 'react-materialize';
import '../../../styles/component-styles/Expense.css';

class ExpenseOutput extends Component {
  constructor(props){
    super(props);
    this.state = {
      expenseData: [],
      toggle: 'ASC',
      sortOrder: '',
      isLoading: true,
      deletingId: null,
      error: ''
    }
  }
  
  componentDidMount(){
    this.fetchExpenses();
  }

  componentDidUpdate(prevProps){
    if (this.props.refreshKey !== prevProps.refreshKey) {
      this.fetchExpenses(this.state.sortOrder, this.state.toggle);
    }
  }

  fetchExpenses(sortOrder, toggle){
    const query = sortOrder
      ? `?sortOrder=${sortOrder}&toggle=${toggle || this.state.toggle}`
      : '';

    this.setState({ isLoading: true, error: '' });

    fetch(`http://localhost:3001/api/getAll${query}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not load expense report.');
        }
        return response.json();
      })
      .then(responseData => {
        this.setState({ expenseData: responseData, isLoading: false });
      })
      .catch(err => {
        this.setState({ error: err.message, isLoading: false, expenseData: [] });
      });
  }

  sortChoice(e){
    e.preventDefault();
    const nextToggle = this.state.toggle === 'ASC' ? 'DESC' : 'ASC';
    this.setState({
      toggle: nextToggle,
      sortOrder: e.target.value
    });
    this.fetchExpenses(e.target.value, nextToggle);
  }

  handleDelete(productId){
    const item = this.state.expenseData.find(entry => entry.id === productId);
    const productName = item ? item.name : 'this entry';

    if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) {
      return;
    }

    this.setState({ deletingId: productId });

    fetch(`http://localhost:3001/api/deleteExpense/${productId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Delete failed');
        }
        return response.json();
      })
      .then(() => {
        this.setState({ deletingId: null });
        this.fetchExpenses(this.state.sortOrder, this.state.toggle);
        if (this.props.onDataChange) {
          this.props.onDataChange();
        }
      })
      .catch(() => {
        this.setState({ deletingId: null });
        window.alert('Could not delete this entry. Please try again.');
      });
  }

  render() {
    return (
      <div className="tableReport">
        <h4>Expense Report</h4>
        { this.state.isLoading ? <p>Loading report...</p> : null }
        { this.state.error ? <p className="output-error">{this.state.error}</p> : null }
        { !this.state.isLoading && !this.state.error && this.state.expenseData.length === 0 ? (
          <p className="output-empty">No expenses yet. Submit a transaction from the Input page.</p>
        ) : null }
        { !this.state.isLoading && !this.state.error && this.state.expenseData.length > 0 ?
        <table>
          <thead>
            <tr>
              <th><Button className="butn">Idx</Button></th>
              <th><Button className="butn" value="merchant.store_name" onClick={this.sortChoice.bind(this)}>Store</Button></th>
              <th><Button className="butn" value="transaction.amount" onClick={this.sortChoice.bind(this)}>Amount</Button></th>
              <th><Button className="butn" value="transaction.date" onClick={this.sortChoice.bind(this)}>Date</Button></th>
              <th><Button className="butn" value="product.name" onClick={this.sortChoice.bind(this)}>Transaction Type</Button></th>
              <th><Button className="butn" value="category.name" onClick={this.sortChoice.bind(this)}>Product</Button></th>
               
              <th>Delete</th>
            </tr>
          </thead>
        <tbody>
          {this.state.expenseData.map((item, i)=> {
            return (
            <tr key={item.id}>
              <td>{i+1}</td>
<td>{item.productTransaction?.transactionMerchant?.store_name || '-'}</td>
              <td>
  {item.productTransaction?.amount != null
    ? Number(item.productTransaction.amount).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR'
      })
    : '-'}
</td>
           <td>{item.productTransaction?.date || '-'}</td>
              <td id="product">{item.name || '-'}</td>
              <td>{item.productTransaction?.transactionCategory?.name || '-'}</td>
              {/* <td>{item.no_of_units != null ? item.no_of_units : '-'}</td> */}
              <td>
                <Button
                  className="delete-btn"
                  waves="light"
                  disabled={this.state.deletingId === item.id}
                  onClick={() => this.handleDelete(item.id)}
                >
                  {this.state.deletingId === item.id ? 'Deleting...' : 'Delete'}
                </Button>
              </td>
            </tr>);
          })
          }
        </tbody>
      </table> : null
      }
      </div>
    );
  }
}

export default ExpenseOutput;
