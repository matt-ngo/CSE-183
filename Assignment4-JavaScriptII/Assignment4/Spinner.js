/**
 * CSE183 Assignment 4 - Stretch
 */
class Spinner {
  /**
   * Create a date picker
   * @param {string} containerId id of a node the Picker will be a child of
   */
  constructor(containerId) {
    this.containerId = containerId;
    // this.makeSpinner(new Date());
  }

  /**
   * given month's index, return its name
   * @param {int} num month number
   * @return {string} month name
   */
  getMonth(num) {
    const months = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEPT',
      'OCT',
      'NOV',
      'DEC',
    ];
    return months[num];
  }

  /**
   * render the month part and its buttons
   * @param {Date.month} month
   * @param {Date.day} day
   * @param {Date.year} year
   * @param {div} container
   */
  makeMonth(month, day, year, container) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'monthContainer container';

    // left button
    const prevMonth = document.createElement('button');
    prevMonth.innerHTML = '&#9664';
    prevMonth.id = 'prevMonth';
    prevMonth.addEventListener('click', () => {
      this.makeSpinner(new Date(year, month - 2, day));
    });
    monthDiv.appendChild(prevMonth);

    // month
    const monthName = document.createElement('div');
    monthName.id = 'month';
    monthName.className = 'label';
    monthName.innerHTML = this.getMonth(month - 1);
    monthDiv.appendChild(monthName);

    // right button
    const nextMonth = document.createElement('button');
    nextMonth.innerHTML = '&#9654';
    nextMonth.id = 'nextMonth';
    nextMonth.addEventListener('click', () => {
      this.makeSpinner(new Date(year, month, day));
    });
    monthDiv.appendChild(nextMonth);

    container.appendChild(monthDiv);
  }

  /**
   * render the day part and its buttons
   * @param {Date.month} month
   * @param {Date.day} day
   * @param {Date.year} year
   * @param {div} container
   */
  makeDay(month, day, year, container) {
    const dayDiv = document.createElement('div');
    month = month-1;
    dayDiv.className = 'dayContainer container';

    // left button
    const prevDay = document.createElement('button');
    prevDay.innerHTML = '&#9664';
    prevDay.id = 'prevDay';
    prevDay.addEventListener('click', () => {
      this.makeSpinner(new Date(year, month, day - 1 ));
    });
    dayDiv.appendChild(prevDay);

    // day
    const dayName = document.createElement('div');
    dayName.id = 'day';
    dayName.className = 'label';
    dayName.innerHTML = day;
    dayDiv.appendChild(dayName);

    // right button
    const nextDay = document.createElement('button');
    nextDay.innerHTML = '&#9654';
    nextDay.id = 'nextDay';
    nextDay.addEventListener('click', () => {
      this.makeSpinner(new Date(year, month, day + 1));
    });
    dayDiv.appendChild(nextDay);

    container.appendChild(dayDiv);
  }


  /**
   * render the year part and its buttons
   * @param {Date.month} month
   * @param {Date.day} day
   * @param {Date.year} year
   * @param {div} container
   */
  makeYear(month, day, year, container) {
    const yearDiv = document.createElement('div');
    month = month-1;
    yearDiv.className = 'yearContainer container';

    // left button
    const prevYear = document.createElement('button');
    prevYear.innerHTML = '&#9664';
    prevYear.id = 'prevYear';
    prevYear.addEventListener('click', () => {
      this.makeSpinner(new Date(year-1, month, day)); // day
    });
    yearDiv.appendChild(prevYear);

    // year
    const yearName = document.createElement('div');
    yearName.id = 'year';
    yearName.className = 'label';
    yearName.innerHTML = year;
    yearDiv.appendChild(yearName);

    // right button
    const nextYear = document.createElement('button');
    nextYear.innerHTML = '&#9654';
    nextYear.id = 'nextYear';
    nextYear.addEventListener('click', () => {
      this.makeSpinner(new Date(year+1, month, day));
    });
    yearDiv.appendChild(nextYear);

    container.appendChild(yearDiv);
  }


  /**
   * Create the date picker, rendering the header then the
   * @param {Date} date
   */
  makeSpinner(date) {
    // for easy referencing later on
    const container = document.getElementById(this.containerId);
    // parse out current month/year info from date object
    const month = date.getMonth() + 1; // (0-11)
    const day = date.getDate();
    const year = date.getFullYear();
    // get rid of old (previous month's) children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    this.makeMonth(month, day, year, container);
    this.makeDay(month, day, year, container);
    this.makeYear(month, day, year, container);
  }
}

module.exports = Spinner;
