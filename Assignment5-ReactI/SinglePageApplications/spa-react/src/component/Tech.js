import React from "react";

class Tech extends React.Component {
  render() {
    return (
      <div>
        <h2>NERP - It's a thing</h2>
        <ul>
          <li>Node.js</li>
          <li>Express</li>
          <li>React</li>
          <li>PostgreSQL</li>
        </ul>
      </div>
    );
  }
  componentDidMount() { 
    console.log('Tech Created')
  }  
  componentWillUnmount() { 
    console.log('Tech Destroyed')
  }
}

export default Tech;