import './css/App.css';
import React from 'react';
import Div from './Div';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDiv: 0
    }
    this.over = this.over.bind(this);
    this.drop = this.drop.bind(this);
    this.setClickedDiv = this.setClickedDiv.bind(this);
  }


  setClickedDiv(id) {
    this.setState({ selectedDiv: id });
  }
  over(e) {
  }
  drop(e) {

  }


  render() {
    // console.log(this.state.selectedDiv);
    return (
      <div className="App" onDragOver={this.over} onDrop={this.drop}>
        <Div id={1} color='teal' setClickedDiv={this.setClickedDiv} selectedDiv={this.state.selectedDiv}></Div>
        <Div id={2} color='orange' setClickedDiv={this.setClickedDiv} selectedDiv={this.state.selectedDiv}></Div>
        <Div id={3} color='black' setClickedDiv={this.setClickedDiv} selectedDiv={this.state.selectedDiv}></Div>
      </div>
    );
  }
}

export default App;
