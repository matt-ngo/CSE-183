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

test('Current Date', async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true
  });
  const page = await browser.newPage();   
  await page.goto(`file://${__dirname}/spinner.html`);    
  const num = Math.max(1,Math.floor(Math.random()*6));
  for (let i = 0; i < num; i++) {
    await page.click('#prevMonth');
  }
  const month = thisMonth(-num);
  sleep(1000); // very sloppy syncronisation method :(
  const elem = await page.$("#month");
  const cont = await (await elem.getProperty('textContent')).jsonValue();
  expect(cont).toBe(month);
  await browser.close(); 
});