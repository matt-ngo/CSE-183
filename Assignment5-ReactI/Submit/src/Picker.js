import React from 'react';
// import PropTypes from 'prop-types';

/**
 *
 */
class Picker extends React.Component {
  /**
   * @param {props} props
   */
  constructor(props) {
    super(props);
    const currentDate = new Date();
    this.state = {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      dummy: '',
    };
  }

  /**
   * @return {object} hello world
   */
  render() {
    return (
      <div id='picker'>
        {this.getHeader()}
        <table>
          <tbody>
            {this.getDays()}
            {this.getGrid()}
          </tbody>
        </table>
      </div>
    );
  }

  /**
   * given month's index, return its name
   * @param {int} num month number
   * @return {string} month name
   */
  getMonthName(num) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return months[num];
  }

  /**
   * @return {div} month + year + buttons
  */
  getHeader() {
    const month = this.state.month;
    const year = this.state.year;

    // add Month + Year
    return (
      <div>
        {<button
          id="prev"
          onClick={(e) => {
            const newDate = new Date(year, month-1);
            this.setState({
              month: newDate.getMonth(),
              year: newDate.getFullYear(),
            });
          }}>
          &#9664;
        </button> }

        <div id="display">
          {this.getMonthName(month) + ' ' + String(year)}
        </div>

        <button
          id="next"
          onClick={(e) => {
            const newDate = new Date(year, month+1);
            this.setState({
              month: newDate.getMonth(),
              year: newDate.getFullYear(),
            });
          }}>
          &#9654;
        </button>
      </div>
    );
  }

  /**
   * @return {table}
  */
  getDays() {
    const days = [];
    const nameArr = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    nameArr.forEach((i) => {
      days.push(<td>{i}</td>);
    });
    return (<tr key='dummy'>{days}</tr>);
  }

  /**
   * @return {grid}
   */
  getGrid() {
    const table = [];

    const month = this.state.month;
    const year = this.state.year;

    const firstDayIdx = new Date(year, month, 1).getDay();
    const endLen = firstDayIdx + new Date(year, month+1, 0).getDate();

    const todaysDay = new Date().getDate();
    const todaysMonth = new Date().getMonth();
    const todaysYr = new Date().getFullYear();

    let i = 1;
    while (i < 42) {
      let j = 0;
      const children = [];
      while (j < 7) {
        let tempId = '';
        let tempContent = '';

        if ((i-firstDayIdx)==todaysDay &&
          month==todaysMonth &&
          year==todaysYr) {
          tempId = 'today';
        } else {
          tempId = 'd'+String(i-1);
        }

        if (i > firstDayIdx && i <= endLen) {
          tempContent = String(i - firstDayIdx);
        }

        children.push(<td id={tempId}>{tempContent}</td>);
        i++;
        j++;
      }
      table.push(<tr>{children}</tr>);
    }
    return (table);
  }

  /**
   * sets state date to whatever was passed in
   * @param {string} dateStr
   */
  setDate(dateStr) {
    // const temp = dateStr.split('/');
    // const d = new Date(temp[2] + '/' + temp[0] + '/' + temp[1]);
    const d = new Date(Date.parse(dateStr));
    // console.log(d);
    this.setState({
      month: d.getMonth(),
      year: d.getFullYear(),
    });
  }
}


export default Picker;

/*
+ modify the src/Picker.js render() method to remove that temporary Div and
display all the visual elements of your Picker
    Most students find it simplest to make the Picker a table

When the visual elements are displayed correctly and have the correct id's
 then move on and give them the correct values

  Start with the "display" element and set it's value to be the month and year
  Then work out what day of the week the first day of the month is
    This tells you which of d0 to d46 should have a '1' in it
  From there populate the other "d" elements as appropriate,
  Finally clear out any "d" elements that are before or after
    the days in this month

When that's all working, add some style to the Picker to make it look nice
*/
