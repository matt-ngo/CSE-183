const puppeteer = require('puppeteer');

// The browser instance created for each test
let browser;

// Create the browser before each test
beforeEach(async (done) => {
  browser = await puppeteer.launch({
    // headless: false 
  });

  done();
});

// Close the browser after each test
afterEach(async (done) => {
  await browser.close(); 
  done();
});

function firstDate(x) {
	//get 1st day of the current month
  let date = new Date();
	date.setDate(1);
	// get the month x clicks away
	date.setMonth(date.getMonth()+x); 
	// return the week day that the 1st of that month is on
  return date.getDay();
}

function getMonthName(num) {
	const months = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'];
	return months[num];
}

// default display shows today's date
test('Display is Accurate', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	const currentDate = new Date();
	const expectedString = getMonthName(currentDate.getMonth())
													+ ' ' + currentDate.getFullYear()
	const display = await page.$("#display");
	const msg = await (await display.getProperty('textContent')).jsonValue();

	expect(msg).toBe(expectedString);
});

//today is accurate
test('ID #today is Accurate', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	const currentDate = new Date();
	const expectedString = String(currentDate.getDate())

	const today = await page.$("#today");
	const msg = await (await today.getProperty('textContent')).jsonValue();

	expect(msg).toBe(expectedString);
});

// the 1st is on the right day
test('1st of the Month is Accurate', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	const d = new Date();
	d.setDate(1);

	const offset = d.getDay()

	const first = await page.$("#d"+offset);
	const msg = await (await first.getProperty('textContent')).jsonValue();

	expect(msg).toBe('1');
});

// has the correct number of days
test('Correct Number of Days', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	const d = new Date();
	const month = d.getMonth();
	const year = d.getFullYear();

	// const numDays = new Date(d.getFullYear, d.getMonth, 0).getDate();
	const firstDayIdx = new Date(year, month, 1).getDay();
	const endLen = firstDayIdx + new Date(year, month+1, 0).getDate() - 1;

	const endCell = await page.$("#d"+endLen);
	const msg = await (await endCell.getProperty('textContent')).jsonValue();

	expect(msg).toBe(String(new Date(year, month+1, 0).getDate()));
});

// NEXT MONTH
// display is accurate
test('Next Month Display is Accurate', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.click('#next');
	await page.waitForTimeout(100);

	const d = new Date();
	const month = d.getMonth()+1;
	const year = d.getFullYear();

	const expectedString = getMonthName(month) + ' ' + year
	const display = await page.$("#display");
	const msg = await (await display.getProperty('textContent')).jsonValue();

	expect(msg).toBe(expectedString);
});

// today not present
test('Next Month Has no #today', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.click('#next');
	await page.waitForTimeout(100);

	const today = await page.$("#today");
	// const msg = await (await today.getProperty('textContent')).jsonValue();
	// await expect(page).not.toMatchElement('header')
	expect(today).toBe(null);
});

// 1st on the right day
test('1st of Next Month is Accurate', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.click('#next');
	await page.waitForTimeout(100);

	const d = new Date();
	const month = d.getMonth();
	const year = d.getFullYear();
	d.setMonth(month+1)
	d.setDate(1);
	

	const offset = d.getDay()

	const first = await page.$("#d"+offset);
	const msg = await (await first.getProperty('textContent')).jsonValue();

	expect(msg).toBe('1');
});

// correct number of days
test('Next Month Has Correct Number of Days', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.click('#next');
	await page.waitForTimeout(100);

	const d = new Date();
	const month = d.getMonth() + 1;
	const year = d.getFullYear();

	const firstDayIdx = new Date(year, month, 1).getDay();
	const endLen = firstDayIdx + new Date(year, month+1, 0).getDate() - 1;

	const endCell = await page.$("#d"+endLen);
	const msg = await (await endCell.getProperty('textContent')).jsonValue();

	expect(msg).toBe(String(new Date(year, month+1, 0).getDate()));
});

// PREV MONTH
// display is accurate
test('Prev Month Display is Accurate', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.click('#prev');
	await page.waitForTimeout(100);

	const d = new Date();
	const month = d.getMonth()-1;
	const year = d.getFullYear();

	const expectedString = getMonthName(month) + ' ' + year
	const display = await page.$("#display");
	const msg = await (await display.getProperty('textContent')).jsonValue();

	expect(msg).toBe(expectedString);
});

// today not present
test('Prev Month Has no #today', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.click('#prev');
	await page.waitForTimeout(100);

	const today = await page.$("#today");
	expect(today).toBe(null);
});

// 1st on the right day
test('1st of Prev Month is Accurate', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.click('#prev');
	await page.waitForTimeout(100);

	const d = new Date();
	const month = d.getMonth();
	const year = d.getFullYear();
	d.setMonth(month-1)
	d.setDate(1);
	

	const offset = d.getDay()

	const first = await page.$("#d"+offset);
	const msg = await (await first.getProperty('textContent')).jsonValue();

	expect(msg).toBe('1');
});

// correct number of days
test('Prev Month Has Correct Number of Days', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.click('#prev');
	await page.waitForTimeout(100);

	const d = new Date();
	const month = d.getMonth() - 1;
	const year = d.getFullYear();

	const firstDayIdx = new Date(year, month, 1).getDay();
	const endLen = firstDayIdx + new Date(year, month+1, 0).getDate() - 1;

	const endCell = await page.$("#d"+endLen);
	const msg = await (await endCell.getProperty('textContent')).jsonValue();

	expect(msg).toBe(String(new Date(year, month-1, 0).getDate()));
});

// #next then #prev lands you at today
test('Clicking #next then #prev', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.click('#next');
	await page.waitForTimeout(100);
	await page.click('#prev');
	await page.waitForTimeout(100);

	const currentDate = new Date();
	const expectedString = String(currentDate.getDate())

	const today = await page.$("#today");
	const msg = await (await today.getProperty('textContent')).jsonValue();

	expect(msg).toBe(expectedString);
});

//test from assignment 4 for d's
//the 1st plus x days' value = d(1st days index + x)
test('A4 - Next Month', async () => {
  const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');
   
  const num = Math.max(1,Math.floor(Math.random()*28));
  for (let i = 0; i < num; i++) {
    await page.click('#next');
    await page.waitForTimeout(100);
	}
	
	await page.waitForTimeout(500);
	// d + 1st weekday + num -1 == num
  const elem = await page.$("#d"+(firstDate(num)+num-1));
  const cont = await (await elem.getProperty('textContent')).jsonValue();
	expect(cont).toBe(''+num);
});

test('Button ID\'s Exist', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	let result = await page.$("#prev")
	expect(result).not.toBe(null);

	result = await page.$("#next")
	expect(result).not.toBe(null);
});