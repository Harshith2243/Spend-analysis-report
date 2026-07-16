import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

class StoreCatsOutput extends Component {
  constructor(props){
    super(props);
    this.state = {
      chartData: null,
      isLoading: true,
      error: ''
    }
  }

  componentDidMount(){
    this.loadChart();
  }

  componentDidUpdate(prevProps){
    if (this.props.refreshKey !== prevProps.refreshKey) {
      this.loadChart();
    }
  }

  loadChart(){
    this.setState({ isLoading: true, error: '' });

    fetch('http://127.0.0.1:3001/api/getTPC', {
      method: 'GET',
      mode: 'cors',
      headers: {
        "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not load analytics.');
        }
        return response.json();
      })
      .then(responseData => {
        const hasData = responseData &&
          responseData.labels &&
          responseData.labels.length > 0 &&
          responseData.datasets &&
          responseData.datasets[0] &&
          responseData.datasets[0].data &&
          responseData.datasets[0].data.length > 0;

        this.setState({
          chartData: hasData ? responseData : null,
          isLoading: false
        });
      })
      .catch(err => {
        this.setState({ error: err.message, isLoading: false, chartData: null });
      });
  }

  render() {
    return (
      <div className="analytics-card">
        <h4>Transactions By Product</h4>
        { this.state.isLoading ? <p>Loading analytics...</p> : null }
        { this.state.error ? <p className="output-error">{this.state.error}</p> : null }
        { !this.state.isLoading && !this.state.error && !this.state.chartData ? (
          <p className="output-empty">No analytics yet. Add a transaction to see the chart.</p>
        ) : null }
        { !this.state.isLoading && this.state.chartData ? (
          <div className="chart-wrap">
            <Doughnut data={this.state.chartData} />
          </div>
        ) : null }
      </div>
    );
  }
}

export default StoreCatsOutput;
