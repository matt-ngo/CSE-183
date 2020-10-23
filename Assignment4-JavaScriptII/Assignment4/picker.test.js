const puppeteer = require('puppeteer');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function firstDate(relative) {
  let date = new Date();
  date.setMonth(date.getMonth()+relative); 
  date.setDate(1);
  return date.getDay();
}

test('Month', async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    // devtools: true
  });
  const page = await browser.newPage();   
  await page.goto(`file://${__dirname}/picker.html`);    
  const num = Math.max(1,Math.floor(Math.random()*28));
  for (let i = 0; i < num; i++) {
    await page.click('#next');
  }
  sleep(1000); // very sloppy syncronisation method :(
  const elem = await page.$("#d"+(firstDate(num)+num-1));
  const cont = await (await elem.getProperty('textContent')).jsonValue();
  expect(cont).toBe(''+num);
  await browser.close(); 
});
