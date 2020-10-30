const puppeteer = require('puppeteer');

function firstDate(relative) {
  let date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth()+relative); 
  return date.getDay();
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

test('Next Month', async () => {
  const page = await browser.newPage();   
  await page.goto(`file://${__dirname}/picker.html`);    
  const num = Math.max(1,Math.floor(Math.random()*28));
  for (let i = 0; i < num; i++) {
    await page.click('#next');
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(500);
  const elem = await page.$("#d"+(firstDate(num)+num-1));
  const cont = await (await elem.getProperty('textContent')).jsonValue();
  expect(cont).toBe(''+num);
});
