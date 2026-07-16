import React, { Component } from 'react';
import { Button } from 'react-materialize';
import "../../styles/page-styles/Output.css";
import PieOutput from "../components/output/PieOutput";
import ExpenseOutput from "../components/output/ExpenseOutput";

class Output extends Component {
  constructor(props){
    super(props);
    this.state = {
      view: 'all',
      refreshKey: Date.now()
    }
  }

  componentDidMount(){
    this.refreshAnalytics();
  }

  refreshAnalytics(){
    this.setState({ refreshKey: Date.now() });
  }

  handleChange(event){
    this.setState({ view: event.target.value });
  }

  renderView(){
    const refreshKey = this.state.refreshKey;

    switch(this.state.view){
      case 'store':
        return <PieOutput refreshKey={refreshKey} />;
      case 'expense':
        return <ExpenseOutput refreshKey={refreshKey} onDataChange={this.refreshAnalytics.bind(this)} />;
      default:
        return (
          <div>
            <PieOutput refreshKey={refreshKey} />
            <ExpenseOutput refreshKey={refreshKey} onDataChange={this.refreshAnalytics.bind(this)} />
          </div>
        );
    }
  }

  render() {
    return (
      <div className="output-page app-card">
        <p className="eyebrow">Analytics</p>
        <h2>Visualizations</h2>
        <p className="intro-copy">Switch between views to inspect your spending habits with clarity and focus.</p>
        <div className="button-group">
          <Button className="button" waves='light' name="view" value='all' onClick={this.handleChange.bind(this)}>Show All Analytics</Button>
          <Button className="button" waves='light' name="view" value='store' onClick={this.handleChange.bind(this)}>Chart Only</Button>
          <Button className="button" waves='light' name="view" value='expense' onClick={this.handleChange.bind(this)}>Table Only</Button>
          <Button className="button" waves='light' onClick={this.refreshAnalytics.bind(this)}>Refresh</Button>
        </div>
        {this.renderView()}
      </div>
    );
  }
}

export default Output;
