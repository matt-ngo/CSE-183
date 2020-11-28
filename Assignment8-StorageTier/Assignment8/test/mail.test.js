const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../src/app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
});

describe('Advanced', function () {
  test('GET Invalid URL', async () => {
    await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
      .expect(404);
  });

  test('GET All - 200', async () => {
    await request.get('/v0/mail')
      .expect(200)
  });

  test('GET All - Test No Content', async () => {
    await request.get('/v0/mail')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(data => {
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
        for (const mailbox of data.body) {
          for (const email of mailbox['mail']) {
            expect(email['content']).not.toBeDefined();
          }
        }
      })
  });

  let inboxID_1 = '';
  let inboxID_2 = '';
  let inboxID_3 = '';

  test('GET One Mailbox: Existing', async () => {
    await request
      .get('/v0/mail?mailbox=inbox')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((data) => {
        inboxID_1 = data.body[0].mail[0].id;
        inboxID_2 = data.body[0].mail[1].id;
        inboxID_3 = data.body[0].mail[2].id;
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
      });
  });
  
  test('GET One Mailbox: DNE', async () => {
    await request.get('/v0/mail?mailbox=foobar').expect(404);
  });

  test('GET by ID: Existing', async () => {
    await request
      .get('/v0/mail/' + inboxID_1)
      .expect(200)
      .expect('Content-Type', /json/)
  });
  
  test('GET by ID: DNE', async () => {
    await request
      .get('/v0/mail/45cfebf4-2eef-4706-98f9-5587afd09313')
      .expect(404);
  });
  
  const postTest = {
    "to": {
      "name": "post test 1",
      "email": "postTest@example.com"
    },
    "subject": "string",
    "content": "string"
  };

  test('POST New: Valid', async () => {
    await request.post('/v0/mail/')
      .send(postTest)
      .expect(201)
      .then(data => {
        expect(data.body.id).toBeDefined();
        expect(data.body.mailbox).toBe('sent');
      })
  });

  const postTest2 = {
    "to": {
      "name": "post test 2",
      "email": "postTest2@example.com"
    },
    "from": {
      "name": "post test 2",
      "email": "postTest2@example.com"
    },
    "subject": "string",
    "content": "string"
  };
  
  test('POST New: Invalid - Extra params', async () => {
    await request.post('/v0/mail/')
      .send(postTest2)
      .expect(400)
  });

  const postTest3 = {
    "to": {
      "name": "post test 2",
    },
    "subject": "string",
    "content": "string"
  };
  
  test('POST New: Invalid - Missing params', async () => {
    await request.post('/v0/mail/')
      .send(postTest3)
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

  test('PUT: Moving from Inbox to Trash', async () => {
    await request.put('/v0/mail/'+inboxID_1+'?mailbox=trash')
      .expect(204)
      .then(data => {
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
        request.get('/v0/mail/'+inboxID_1).expect(200)
      })
  });

  test('PUT: Moving from Inbox to Inbox', async () => {
    await request.put('/v0/mail/'+inboxID_2+'?mailbox=inbox')
      .expect(204)
      .then(data => {
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
        request.get('/v0/mail/'+inboxID_2).expect(200)
      })
  });

  test('PUT: Moving from Inbox to a new Mailbox', async () => {
    await request.put('/v0/mail/'+inboxID_3+'?mailbox=newMailbox')
      .expect(204)
      .then(data => {
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
        request.get('/v0/mail/'+inboxID_3).expect(200)
      })
  });

  test('PUT: Moving from Sent to Sent', async () => {
    let tempID = '';
    await request
      .get('/v0/mail?mailbox=sent')
      .expect(200)
      .then((data) => {
        tempID = data.body[0].mail[0].id;
      });
    await request.put('/v0/mail/'+tempID+'?mailbox=sent')
      .expect(204)
  });

  test('PUT: Moving from Inbox to Sent -> 409', async () => {
    await request.put('/v0/mail/'+inboxID_2+'?mailbox=sent')
      .expect(409)
  });

  test('PUT: Invalid ID -> 404', async () => {
    await request.put('/v0/mail/93e3ffa3-2722-47ea-8caa-74f8a254ee8a?mailbox=sent')
      .expect(404)
  });

  
});


describe('Stretch', function () {
  test('GET FROM: Existing - Correct Content ', async () => {
    await request
      .get('/v0/mail?from=CSE183')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((data) => {
        expect(data.body[0].mail[0].from.name).toBe('CSE183 Student')
      });
  });

  test('GET FROM: Existing - Correct Length ', async () => {
    await request
      .get('/v0/mail?from=CSE183')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((data) => {
        expect(data.body[0].mail.length).toEqual(102);
      });
  });

  test('GET FROM: Nonexisting Name', async () => {
    await request
      .get('/v0/mail?from=asdfasdf')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((data) => {
        expect(data.body).toEqual([]);
      });
  });

  test('GET FROM: Fuzzy Search "gEoRg"', async () => {
    await request
      .get('/v0/mail?from=gEoRg')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((data) => {
        expect(data.body.length).toEqual(1);
      });
  });

  test('GET FROM: Fuzzy Search "jo"', async () => {
    await request
      .get('/v0/mail?from=jo')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((data) => {
        expect(data.body[0].mail.length + data.body[1].mail.length).toBe(10);
      });
  });
  
  test('GET FROM + MAILBOX: EXISTING - from="jo", mailbox="inbox"', async () => {
    await request
      .get('/v0/mail?mailbox=inbox&from=jo')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((data) => {
        expect(data.body[0].mail.length).toBe(5);
      });
  });

  test('GET FROM + MAILBOX: EXISTING - from="keen", mailbox="inbox"', async () => {
    await request
      .get('/v0/mail?mailbox=inbox&from=keen') //
      .expect(200)
      .expect('Content-Type', /json/)
      .then((data) => {
        expect(data.body[0].mail.length).toBe(1);
      });
    
  });

  test('GET FROM + MAILBOX: DNE - from="keen", mailbox="sent"', async () => {
    await request
      .get('/v0/mail?mailbox=sent&from=keen')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((data) => {
        expect(data.body).toEqual([]);
      });
  });
});
