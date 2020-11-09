import React from 'react';

import Picker from './Picker';
import './Picker.css';
/**
 * Simple component with no state.
 *
 * See the basic-react from lecture 11 for an example of adding and
 * reacting to changes in state.
 */
class App extends React.Component {
  /**
   * @param {props} props
   */
  constructor(props) {
    super(props);
    this.pickerRef = React.createRef();

    this.state = {value: '', valid: false};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  /**
   * @return {*} a <div> containing an <h2>
   */
  render() {
    return (
      <div>
        <h2 id='welcome'>CSE183 Assignment 5 - React I</h2>
        <Picker ref={this.pickerRef}/>

        <div id='stretch'>
          {/* validate input on change */}
          <input
            id='date'
            type='text'
            placeholder='MM/DD/YYYY'
            value={this.state.value}
            onChange={this.handleChange}>
          </input>

          <button
            id='set'
            type='submit'
            disabled={this.state.valid==false}
            onClick = {this.handleSubmit}
            value = 'set date' >Set</button>
        </div>
      </div>
    );
  }
  /**
   * @param {*} event
  */
  handleChange(event) {
    // update input content value and determine if valid form
    this.setState({value: event.target.value}, ()=>{
      this.setState({valid: this.validDate()});
    });
  }
  /**
   * @param {*} event
  */
  handleSubmit(event) {
    // console.log('Date Submitted : ', this.state.value);
    this.pickerRef.current.setDate(this.state.value);
  }

  /**
   * checks if the current day is over the amount of days available
   * in the new month, if so, go to the last day of the new month
   * @param {Date.month} newMonth
   * @param {Date.year} currentYear
   * @param {Date.day} currentDay
   * @return {Date.day} max date of the next month
   */
  roundDate(newMonth, currentYear, currentDay) {
    const lastDay = new Date(currentYear, newMonth+1, 0).getDate();

    if (currentDay>lastDay) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * validates string, if input is valid, it sets state var valid=true
   * mm/dd/yyyy - 0/1/2
   * @return {bool}
   */
  validDate() {
    const dateStr = this.state.value;
    const splitDate = dateStr.split('/');
    const date = Date.parse(dateStr);

    const formatted = (/^\d{1,2}\/\d{1,2}\/(\d{2}|\d{4})$/.test(dateStr));

    const inBounds = this.roundDate(parseInt(splitDate[0], 10)-1,
        parseInt(splitDate[2], 10),
        parseInt(splitDate[1], 10));


    return (date != NaN && formatted && inBounds);

    // const temp = dateStr.split('/');
    // const d = new Date(temp[2] + '/' + temp[0] + '/' + temp[1]);
    // return (d &&
    //   (d.getMonth() + 1) == temp[0] &&
    //   d.getDate() == Number(temp[1]) &&
    //   (d.getFullYear() == Number(temp[2]) ||
    //   d.getYear() == Number(temp[2]))
    // );
  }
}


export default App;
