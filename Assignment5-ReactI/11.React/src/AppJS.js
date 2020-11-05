import React from "react";

class App extends React.Component {
  state = {
    name: null,
  };
  constructor(props) {
    super(props); 
  }
  render() {
    const label = React.createElement('label', null,'Name: ');
    const input = React.createElement('input',
      { type: 'text', value: this.state.name,
        onInput: (event) => this.handleInput(event) });
    const message = React.createElement('h1', null,
      'Hello ', this.state.name, '!');
    return React.createElement('div', null, label, input, message);
  }
  handleInput = (event) => {
    this.setState({ name: event.target.value });
  }
}

export default App;
