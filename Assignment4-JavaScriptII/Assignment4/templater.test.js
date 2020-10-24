
const puppeteer = require('puppeteer');
const fs = require('fs')

function age() {
  return 20 + Math.floor(Math.random() * 60); 
}

const fnames = ['John', 'Paul', 'George', 'Ringo'];
const lnames = ['Lennon', 'McCartney', 'Harrison', 'Starr'];

function nam() {
  return fnames[Math.floor(Math.random()*fnames.length)] + ' ' +
    lnames[Math.floor(Math.random()*lnames.length)];
}

function add() {
  return age() + ' Penny Lane';
}

function generate() { 
  return { 
    H1: 'Name', H2: 'Address', H3: 'Age',
    R11: nam(), R12: add(), R13: '' + age(),
    R21: nam(), R22: add(), R23: '' + age(),
    R31: nam(), R32: add(), R33: '' + age(),
    R41: nam(), R42: add(), R43: '' + age(),
    R51: nam(), R52: add(), R53: '' + age()
  };
}

function randomTag() {
  return 'T' + (1000 + Math.floor(Math.random() * 9000));  
}

function randomise(sparse) {
  const content = fs.readFileSync(`${__dirname}/templater.html`, {encoding:'utf8', flag:'r'});
  const data = generate();
  let result = content;
  var json = '{';
  let map = new Map();
  let empty = [];
  for (let prop in data) {
    let tag = randomTag();
    result = result.replace('"'+prop+'"', '"'+tag+'"');
    if (sparse && (Math.random() < 0.5)) {
      empty.push(tag);
      delete data[prop];
    }
    else {
      if (json.length > 1) {
        json += ',';
      }
      json += '"' +tag +'":"' + data[prop] + '"';
    }
    map[tag] = prop;
  }
  json += '}';
  fs.writeFile(`${__dirname}/tagged.templater.html`, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
  return {data: data, obf: JSON.parse(json), map: map, empty: empty};
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
  fs.unlinkSync(`${__dirname}/tagged.templater.html`);
  done();
});

async function basic(byTag, sparse) {
  const all = randomise(sparse);
  const data = all.data;
  const obf = all.obf;
  const map = all.map;
  const empty = all.empty;
  const page = await browser.newPage();   
  await page.goto(`file://${__dirname}/tagged.templater.html`);    
  await page.$eval('#json', el => el.value = '');
  const json = await page.$("#json");
  await json.focus();
  await page.keyboard.type(JSON.stringify(byTag?data:obf));
  await page.click('#'+(byTag?'byTag':'byId'));
  await sleep(1000); 
  for (let prop in obf) {
    const elem = await page.$("#"+prop);
    const cont = await (await elem.getProperty('textContent')).jsonValue();
    expect(cont).toBe(obf[prop]);
  }
  for (let prop of empty) {
    const elem = await page.$("#"+prop);
    const cont = await (await elem.getProperty('textContent')).jsonValue();
    expect(cont).toBe('');
  }
}

test('By Tag Dense', async () => {
  await basic(true,false);
});

test('By Tag Sparse', async () => {
  await basic(true,true);
});

test('By ID Dense', async () => {
  await basic(false,false);
});

test('By ID Sparse', async () => {
  await basic(true,true);
});

