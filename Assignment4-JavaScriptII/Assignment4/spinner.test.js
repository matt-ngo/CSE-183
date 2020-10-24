const puppeteer = require('puppeteer');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function thisMonth(relative) {
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  let date = new Date();
  date.setMonth(date.getMonth()+relative); 
  return months[date.getMonth()];
}

let browser;

beforeEach(async (done) => {
  browser = await puppeteer.launch({
    //headless: false,
    //devtools: true
  });
  done();
});

afterEach(async (done) => {
  await browser.close(); 
  done();
});

test('Previous Month', async () => {
  const page = await browser.newPage();   
  await page.goto(`file://${__dirname}/spinner.html`);    
  const num = Math.max(1,Math.floor(Math.random()*6));
  for (let i = 0; i < num; i++) {
    await page.click('#prevMonth');
  }
  await sleep(1000); 
  const elem = await page.$("#month");
  const cont = await (await elem.getProperty('textContent')).jsonValue();
  expect(cont).toBe(thisMonth(-num));
});