const supertest = require('supertest');
const http = require('http');
const fs = require('fs');
const app = require('../src/app');

// cache some copies

const inboxCopy = require('../data/inbox.json').map((x)=>x);
const sentCopy = require('../data/sent.json').map((x)=>x);
const trashCopy = require('../data/trash.json').map((x)=>x);

let server;


beforeAll(() => {
  
  fs.writeFile('./data/inbox.json', JSON.stringify(inboxCopy, null, 2), (err) => {
    if (err) return console.log(err);
  });
  fs.writeFile('./data/sent.json', JSON.stringify(sentCopy, null, 2), (err) => {
    if (err) return console.log(err);
  });
  fs.writeFile('./data/trash.json', JSON.stringify(trashCopy, null, 2), (err) => {
    if (err) return console.log(err);
  });
});

afterAll(() => {
  
  fs.writeFile('./data/inbox.json', JSON.stringify(inboxCopy, null, 2), (err) => {
    if (err) return console.log(err);
  });
  fs.writeFile('./data/sent.json', JSON.stringify(sentCopy, null, 2), (err) => {
    if (err) return console.log(err);
  });
  fs.writeFile('./data/trash.json', JSON.stringify(trashCopy, null, 2), (err) => {
    if (err) return console.log(err);
  });

  fs.unlink('./data/newMailbox.json',function(err){
    if(err) return console.log(err);
  });  
});

beforeEach(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
});

afterEach((done) => {
  server.close(done);
});


uuidGen = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// ======================= ADVANCED TESTING ======================= //

test('GET Invalid URL', async () => {
  await request.get('/v0/asdf/').expect(404);
});

test('GET All', async () => {
  await request
    .get('/v0/mail')
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
    });
});

test('GET One Mailbox: Existing', async () => {
  await request
    .get('/v0/mail?mailbox=inbox')
    .expect(200)
    // .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      arr = JSON.parse(data.text)[0];

      expect(arr.name).toEqual('inbox');
      expect(arr.mail.length).toEqual(100);
      expect(arr.mail[0].id).toEqual('591b428e-1b99-4a56-b653-dab17210b3b7');
      expect(arr.mail[0].subject).toEqual('Broderskab (Brotherhood)');
      expect(arr.mail[0]['from-name']).toEqual("Cherye O'Loughane");
      expect(arr.mail[0]['from-email']).toEqual('coloughane0@nymag.com');
    });
});

test('GET One Mailbox: DNE', async () => {
  await request.get('/v0/mail?mailbox=foobar').expect(404);
});

test('GET by ID: Existing', async () => {
  await request
    .get('/v0/mail/53b006f2-0357-41dc-9674-f06352ef1d51')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.id).toBeDefined();
      expect(data.body['subject']).toEqual('The Deep Six');
      expect(data.body['received']).toEqual('2019-11-26T18:27:41Z');
      expect(data.body['from-name']).toEqual('Deny Harwell');
      expect(data.body['from-email']).toEqual('dharwell2f@icq.com');
    });
});

test('GET by ID: DNE', async () => {
  await request
    .get('/v0/mail/45cfebf4-2eef-4706-98f9-5587afd09313')
    .expect(404);
});

const postTest = {
  "to-name": "string",
  "to-email": "user@example.com",
  "subject": "string",
  "received": "2020-11-20T00:44:32.879Z",
  "content": "string"
};

test('POST New: Valid', async () => {
  await request.post('/v0/mail/')
    .send(postTest)
    .expect(201)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.id).toBeDefined();
      expect(data.body.content).toEqual(postTest['content']);
      expect(data.body['to-name']).toEqual(postTest['to-name']);
      expect(data.body['to-email']).toEqual(postTest['to-email']);
      expect(data.body['subject']).toEqual(postTest['subject']);
      expect(data.body['received']).toEqual(postTest['received']);
    })
});

const postTest2 = {
  "to-name": "string",
  "to-email": "user@example.com",
  "subject": "string",
  "received": "2020-11-20T00:44:32.879Z",
  "content": "string",
  "from-name": "Mr. P",
  "from-email": "asdfasdf@seattletimes.com"
};

test('POST New: Invalid', async () => {
  await request.post('/v0/mail/')
    .send(postTest2)
    .expect(400)
});

test('POST then GET an Email', async () => {
  let tempId = ''
  await request.post('/v0/mail/')
    .send(postTest)
    .expect(201)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.id).toBeDefined();
      tempId = data.body.id;
      request.get('/v0/mail/'+tempId).expect(200)
    })
});

// move from inbox to trash
test('PUT: Moving from Inbox to Trash', async () => {
  await request.put('/v0/mail/910f64aa-26d6-4887-85ce-04160aa9550f?mailbox=trash')
    .expect(204)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      // const changedBox = fs.readFileSync('./data/trash.json')
      request.get('/v0/mail/910f64aa-26d6-4887-85ce-04160aa9550f').expect(200)
    })
});

// move from inbox to a new mailbox, delete that mailbox after
test('PUT: Moving from Inbox to a new Mailbox', async () => {
  await request.put('/v0/mail/910f64aa-26d6-4887-85ce-04160aa9550f?mailbox=newMailbox')
    .expect(204)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      request.get('/v0/mail/910f64aa-26d6-4887-85ce-04160aa9550f').expect(200)
      fs.unlink('./data/newMailbox.json',function(err){
        if(err) return console.log(err);
      });  
    })
});

// move from sent to sent
test('PUT: Moving from Sent to Sent', async () => {
  await request.put('/v0/mail/3b21d169-0ab5-4b42-8681-4909551f0a95?mailbox=sent')
    .expect(204)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      request.get('/v0/mail/3b21d169-0ab5-4b42-8681-4909551f0a95').expect(200)
    })
});

// move from inbox to sent
test('PUT: Moving from Inbox to Sent', async () => {
  await request.put('/v0/mail/910f64aa-26d6-4887-85ce-04160aa9550f?mailbox=sent')
    .expect(409)
});

// ======================= STRETCH TESTING ======================= //
// Server is shut down in between every test (see @ beforEach() afterEach())
// the following tests modify then read data but 
// only after each server has been shut down and restarted

const postTest3 = {
  "to-name": "string",
  "to-email": "user@example.com",
  "subject": "Stretch 1",
  "received": "2020-11-20T00:44:32.879Z",
  "content": "string"
};

test('-STRETCH 1a: POST data in SENT*', async () => {
  await request.post('/v0/mail/')
    .send(postTest3)
    .expect(201)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      postTest3['id'] = data.body.id;
    })
});

test('---STRETCH 1b: Read data just Posted in SENT*', async () => {
  const changedBox = 
  JSON.parse(fs.readFileSync('./data/sent.json'));
  const email = changedBox.find((email) => email.id == postTest3['id'])
  expect(email['subject']).toEqual(postTest3['subject'])
});


// move from inbox to trash
test('-STRETCH 2a: PUT: Moving from Inbox to Trash', async () => {
  await request.put('/v0/mail/910f64aa-26d6-4887-85ce-04160aa9550f?mailbox=trash')
    .expect(204)
});

test('---STRETCH 2b: Read data just moved into Trash*', async () => {
  const changedBox = 
  JSON.parse(fs.readFileSync('./data/trash.json'));
  const email = changedBox.find((email) => email.id == '910f64aa-26d6-4887-85ce-04160aa9550f')
  expect(email['subject']).toEqual('Letter, The')
});

// move from inbox to trash
test('-STRETCH 3a: PUT: Moving from Trash to NEW mailbox', async () => {
  await request.put('/v0/mail/910f64aa-26d6-4887-85ce-04160aa9550f?mailbox=newMailbox')
    .expect(204)
});

test('---STRETCH 3b: See if newMailbox exists', async () => {
  expect(fs.existsSync('./data/newMailbox.json')).toEqual(true)
});

test('---STRETCH 3c: Read data just moved into newMailbox', async () => {
  const changedBox = 
  JSON.parse(fs.readFileSync('./data/newMailbox.json'));
  const email = changedBox.find((email) => email.id == '910f64aa-26d6-4887-85ce-04160aa9550f')
  expect(email['subject']).toEqual('Letter, The')
});
