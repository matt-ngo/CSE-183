import React, { Component } from "react";
 
class Contact extends Component {
  render() {
    return (
      <div>
        <h2>Got Questions?</h2>
        <p>Easiest thing to do is mail me a letter.</p>
      </div>
    );
  }
  componentDidMount() { 
    console.log('Contact Created')
  }  
  componentWillUnmount() { 
    console.log('Contact Destroyed')
  }  
}
 
export default Contact;