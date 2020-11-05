import React from "react";

class Home extends React.Component {
  render() {
    return (
      <div>
        <h2>Welcome</h2>
        <p>Wise, you are, in taking this class.</p>
      </div>
    );
  }
  componentDidMount() { 
    console.log('Home Created')
  }  
  componentWillUnmount() { 
    console.log('Home Destroyed')
  }  
}

export default Home;