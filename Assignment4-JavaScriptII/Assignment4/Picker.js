/**
 * CSE183 Assignment 4 - Advanced
 */
class Picker {
  /**
   * Create a date picker
   * @param {string} containerId id of a node the Picker will be a child of
   */
  constructor(containerId) {
    this.containerId = containerId;
    // this.makeCalendar(new Date());
  }

  /**
   * given month's index, return its name
   * @param {int} num month number
   * @return {string} month name
   */
  getMonth(num) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[num];
  }

  /**
   * write out labels for weekdays on the calendar
   * @param {Date.month} month
   * @param {Date.year} year
   * @param {div} daysTable
   */
  weekLabel(month, year, daysTable) {
    const nameArr = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const nameRow = document.createElement('tr'); // row to store the day
    nameArr.forEach((i) => {
      const dayName = document.createElement('td');
      dayName.innerHTML = i;
      // dayName.classList.add('cell');
      nameRow.append(dayName);
    });
    nameRow.className = 'names';
    daysTable.append(nameRow);
  }

  /**
   * render the days of the calendar
   * @param {Date.month} month
   * @param {Date.year} year
   * @param {div} container
   */
  makeDays(month, year, container) {
    const daysTable = document.createElement('table');

    // make the 'M,...,'S' labels
    this.weekLabel(month, year, daysTable);

    // loop to render out all the days in a table
    // day of the week that the 1st of the month falls on (0-6)
    const firstDayIdx = new Date(year, month-1, 1).getDay();
    // total len = days between first sunday and 1st + (# days in the month)
    const endLen = firstDayIdx + new Date(year, month, 0).getDate();
    // placeholders to check current day for highlighting
    const todaysDay = new Date().getDate();
    const todaysMonth = new Date().getMonth() + 1;
    const todaysYr = new Date().getFullYear();

    let i = 1;
    while (i <= 42) {
      const dayRow = document.createElement('tr');

      let j = 0;
      while (j < 7) {
        const day = document.createElement('td');
        day.id = 'd'+String(i-1);

        // highlight today's date
        if ((i-firstDayIdx)==todaysDay &&
          month==todaysMonth &&
          year==todaysYr) {
          day.classList.add('highlighted');
        }

        // make sure all days before the 1st are blank
        if (i > firstDayIdx && i <= endLen) {
          day.innerHTML = String(i - firstDayIdx);
        }

        dayRow.appendChild(day);

        i++;
        j++;
      }
      daysTable.append(dayRow);
    }
    container.appendChild(daysTable);
  }

  /**
   * render the month & year
   * @param {Date.month} month
   * @param {Date.year} year
   * @param {div} nav sub-container
   */
  addDate(month, year, nav) {
    const monthName = document.createElement('div');
    monthName.className = 'monthname';
    monthName.innerHTML = this.getMonth(month - 1) + ' ' + String(year);
    nav.appendChild(monthName);
  }


  /**
   * render '<' button
   * @param {Date.month} month
   * @param {Date.year} year
   * @param {div} nav sub-container
   */
  addPrev(month, year, nav) {
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&#9664';
    prevBtn.id = 'prev';
    prevBtn.addEventListener('click', () => {
      this.makeCalendar(new Date(year, month - 2));
    });
    nav.appendChild(prevBtn);
  }

  /**
   * render '>' button
   * @param {Date.month} month
   * @param {Date.year} year
   * @param {div} nav sub-container
   */
  addNext(month, year, nav) {
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&#9654';
    nextBtn.id = 'next';
    nextBtn.addEventListener('click', () => {
      this.makeCalendar(new Date(year, month));
    });
    nav.appendChild(nextBtn);
  }

  /**
   * render the month, year, and buttons
   * @param {Date.month} month
   * @param {Date.year} year
   * @param {div} container
   */
  makeNavbar(month, year, container) {
    const navbar = document.createElement('div');
    navbar.className = 'navbar';

    // Month + Year
    this.addDate(month, year, navbar);
    // Previous month button
    this.addPrev(month, year, navbar);
    // Next month button
    this.addNext(month, year, navbar);

    // add the navbar into the main container div
    container.appendChild(navbar);
  }

  /**
   * Create the date picker, rendering the header then the
   * @param {Date} date
   */
  makeCalendar(date) {
    // for easy referencing later on
    const container = document.getElementById(this.containerId);
    // parse out current month/year info from date object
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    // get rid of old (previous month's) children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    this.makeNavbar(month, year, container);
    this.makeDays(month, year, container);
  }
}

new Picker;
