const puppeteer = require('puppeteer');
// Random date func from:
// https://stackoverflow.com/questions/9035627/elegant-method-to-generate-array-of-random-dates-within-two-dates/9035732
const RANDOM_DATE = new Date(+(new Date()) - Math.floor(Math.random()*10000000000));

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

function getMonthName(num) {
	const months = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'];
	return months[num];
}


// input invalid date. set should not be clickable
test('Const Valid Month -> Set = accurate display', async () => {
  const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.type('#date', '1/18/1998', {delay: 20})
	await page.click('#set');
	await page.waitForTimeout(100);

	const setDate = new Date(1998, 0, 18);
	const expectedString = getMonthName(setDate.getMonth())
													+ ' ' + setDate.getFullYear()
	const display = await page.$("#display");
	const msg = await (await display.getProperty('textContent')).jsonValue();

	expect(msg).toBe(expectedString);
});

// input valid date. set should be clickable
test('Randomly Valid Month = Enabled button', async () => {
  const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	const rdate = RANDOM_DATE;
	year = rdate.getFullYear();
	month = rdate.getMonth();
	day = rdate.getDate();
	str = month+'/'+day+'/'+year
	await page.type('#date', str, {delay: 20})

	let button = await page.$('#set:not([disabled])')
	expect(button).not.toBe(null);

	button = await page.$('#set[disabled]')
	expect(button).toBe(null);
});

test('Randomly Entered Month Display is Accurate', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	const rdate = RANDOM_DATE;
	year = rdate.getFullYear();
	month = rdate.getMonth()+1;
	day = rdate.getDate();
	
	str = month+'/'+day+'/'+year
	await page.type('#date', str, {delay: 20});
	await page.click('#set');
	await page.waitForTimeout(100);

	const expectedString = getMonthName(month-1) + ' ' + year
	const display = await page.$("#display");
	const msg = await (await display.getProperty('textContent')).jsonValue();

	expect(msg).toBe(expectedString);
});


test('1st of Randomly Entered Month is Accurate', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	const rdate = RANDOM_DATE;
	year = rdate.getFullYear();
	month = rdate.getMonth()+1;
	day = rdate.getDate();
	str = month+'/'+day+'/'+year
	await page.type('#date', str, {delay: 20});
	await page.click('#set');
	await page.waitForTimeout(100);

	rdate.setDate(1);
	
	const offset = rdate.getDay()

	const first = await page.$("#d"+offset);
	const msg = await (await first.getProperty('textContent')).jsonValue();

	expect(msg).toBe('1');
});

test('Randomly Entered Month Has Correct Number of Days', async () => {
	const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	const rdate = RANDOM_DATE;
	year = rdate.getFullYear();
	month = rdate.getMonth()+1;
	day = rdate.getDate();
	str = month+'/'+day+'/'+year
	await page.type('#date', str, {delay: 20});
	await page.click('#set');
	await page.waitForTimeout(100);


	const firstDayIdx = new Date(year, month-1, 1).getDay();
	const endLen = firstDayIdx + new Date(year, month, 0).getDate() - 1;

	const endCell = await page.$("#d"+endLen);
	const msg = await (await endCell.getProperty('textContent')).jsonValue();

	expect(msg).toBe(String(new Date(year, month, 0).getDate()));
});

// input invalid date. set should not be clickable
test('Invalid Date = Disabled button: STRING', async () => {
  const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.type('#date', 'not-a-date', {delay: 20})

	//https://stackoverflow.com/questions/51524439/checking-an-element-is-disabled-using-puppeteer
	let button = await page.$('#set[disabled]')
	expect(button).not.toBe(null);

	button = await page.$('#set:not([disabled])')
	expect(button).toBe(null);
});

test('Invalid Date = Disabled button: MMM/DD/Y', async () => {
  const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.type('#date', '666/96/6', {delay: 20})

	//https://stackoverflow.com/questions/51524439/checking-an-element-is-disabled-using-puppeteer
	let button = await page.$('#set[disabled]')
	expect(button).not.toBe(null);

	button = await page.$('#set:not([disabled])')
	expect(button).toBe(null);
});

test('Invalid Date = Disabled button: M/D', async () => {
  const page = await browser.newPage();   
	await page.goto('http://localhost:3000/');

	await page.type('#date', '3/7', {delay: 20})

	//https://stackoverflow.com/questions/51524439/checking-an-element-is-disabled-using-puppeteer
	let button = await page.$('#set[disabled]')
	expect(button).not.toBe(null);

	button = await page.$('#set:not([disabled])')
	expect(button).toBe(null);
});
