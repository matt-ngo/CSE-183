const supertest = require('supertest');
const http = require('http');

const app = require('../src/app');

// Populates the Mailboxes --- START ---
const mailboxes = {};

const fs = require('fs');

const dataPath = './data/';
const dataFiles = fs.readdirSync(dataPath, {withFileTypes: true});

for (const dataFile of dataFiles) {
  // Trims the file extension
  // Source: https://bit.ly/3kMT4Uu
  mailboxes[dataFile.name.replace(/\.[^/.]+$/, '')] =
  JSON.parse(fs.readFileSync(dataPath+dataFile.name));
}
// Populates the Mailboxes --- END ---

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
});

afterAll((done) => {
  server.close(done);
});

// Advanced
describe('Advanced', function () {
  test('GET All (Code)', async () => {
    await request.get('/v0/mail')
      .expect(200)
  });

  test('GET All (Length)', async () => {
    await request.get('/v0/mail')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(data => {
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
        expect(data.body.length).toBe(Object.keys(mailboxes).length);
      })
  });

  test('GET All (Content)', async () => {
    await request.get('/v0/mail')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(data => {
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
        // Checks if all content is removed
        for (const mailbox of data.body) {
          for (const email of mailbox['mail']) {
            expect(email['content']).not.toBeDefined();
          }
        }
      })
  });

  test('GET Known Mailbox (Code)', async () => {
    await request.get('/v0/mail?mailbox=inbox')
      .expect(200)
  });

  test('GET Known Mailbox (Length)', async () => {
    await request.get('/v0/mail?mailbox=inbox')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(data => {
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
        expect(data.body.length).toBe(1);
      })
  });

  test('GET Known Mailbox (Content)', async () => {
    await request.get('/v0/mail?mailbox=inbox')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(data => {
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
        // Checks if all content is removed
        for (const mailbox of data.body) {
          for (const email of mailbox['mail']) {
            expect(email['content']).not.toBeDefined();
          }
        }
      })
  });

  test('GET Unknown Mailbox (Code)', async () => {
    await request.get('/v0/mail?mailbox=fake')
      .expect(404)
  });

  test('GET E-mail by Known ID (Code)', async () => {
    await request.get('/v0/mail/d10cbbfe-8b96-4d30-851e-f39b0eb4be0b')
      .expect(200)
  });

  test('GET E-mail by Known ID', async () => {
    await request.get('/v0/mail/d10cbbfe-8b96-4d30-851e-f39b0eb4be0b')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(data => {
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
        expect(data.body.content).toBeDefined();
        expect(data.body['id']).toEqual('d10cbbfe-8b96-4d30-851e-f39b0eb4be0b');
        expect(data.body['from-name']).toEqual('CSE183 Student');
        expect(data.body['from-email']).toEqual('cse183-student@ucsc.edu');
        expect(data.body['subject']).toEqual('Mr. Freedom');
        expect(data.body['received']).toEqual('2020-02-21T02:26:04Z');
        expect(data.body['content']).toEqual('Fusce consequat. Nulla nisl. Nunc nisl.\n\nDuis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.\n\nIn hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.');
        expect(data.body['to-name']).toEqual('Muhammad Caistor');
        expect(data.body['to-email']).toEqual('mcaistor0@google.nl');
      })
  });

  test('GET E-mail by Unknown ID (Code)', async () => {
    await request.get('/v0/mail/d69cbbfe-6b96-9d69-696e-f96b6eb9be6b')
      .expect(404)
  });

  test('POST New E-mail Sent (Code)', async () => {
    await request.post('/v0/mail').send(
      {
        "to-name": "string",
        "to-email": "user@example.com",
        "subject": "string",
        "received": "2020-11-20T06:02:46.856Z",
        "content": "string"
      }
    )
      .expect(201)
  });

  test('POST New E-mail Sent', async () => {
    await request.post('/v0/mail').send(
      {
        "to-name": "string",
        "to-email": "user@example.com",
        "subject": "string",
        "received": "2020-11-20T06:02:46.856Z",
        "content": "string"
      }
    )
      .expect(201)
      .then(data => {
        expect(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(data.body['id'])).toBe(true);
        expect(data.body['from-email']).toBe('cse183-student@ucsc.edu');
        expect(data.body['from-name']).toBe('CSE183 Student');
      })
  });

  test('POST New E-mail Sent w/ Unexpected Properties (Code)', async () => {
    await request.post('/v0/mail').send(
      {
        "to-name": "string",
        "to-email": "user@example.com",
        "subject": "string",
        "received": "2020-11-20T06:02:46.856Z",
        "content": "string",
        "emoji": "happy"
      }
    )
      .expect(400)
  });

  test('PUT E-mail Move Back and Forth b/w Inbox & Trash (Code)', async () => {
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=trash')
      .expect(204)
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=inbox')
    .expect(204)
  });

  test('PUT E-mail Move Back and Forth b/w Inbox & Trash', async () => {
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=trash')
      .expect(204)
    await request.get('/v0/mail?mailbox=trash')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      // Checks if all content is removed
      let found = false;
      for (const mailbox of data.body) {
        for (const email of mailbox['mail']) {
          if (email['id'] == '591b428e-1b99-4a56-b653-dab17210b3b7') {
            found = true;
            break
          }
        }
      }
      expect(found).toBe(true);
    })
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=inbox')
    .expect(204)
  });
  
  test('PUT Unknown E-mail (Code)', async () => {
    await request.put('/v0/mail/d69cbbfe-6b96-9d69-696e-f96b6eb9be6b?mailbox=trash')
      .expect(404)
  });

  test('PUT E-mail from Inbox to Sent (Code)', async () => {
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=sent')
      .expect(409)
  });

  test('PUT E-mail from Inbox to New Mailbox and Back (Code)', async () => {
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=new')
      .expect(204)
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=inbox')
    .expect(204)
    // Deletes the new mailbox
    await fs.unlinkSync(dataPath+'new.json');
  });

  test('PUT E-mail from Inbox to New Mailbox and Back', async () => {
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=new')
      .expect(204)
    await request.get('/v0/mail')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      // Checks if all content is removed
      let found = false;
      for (const mailbox of data.body) {
        if (mailbox['name'] == 'new') {
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    })
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=inbox')
    .expect(204)
    // Deletes the new mailbox
    await fs.unlinkSync(dataPath+'new.json');
  });
});

// Stretch
describe('Stretch', function () {
  test('POST New E-mail Sent (Reboot)', async () => {
    let uuid = '';

    await request.post('/v0/mail').send(
      {
        "to-name": "string",
        "to-email": "user@example.com",
        "subject": "string",
        "received": "2020-11-20T06:02:46.856Z",
        "content": "string"
      }
    )
      .expect(201)
      .then(data => {
        uuid = data.body['id'];
      })

    // Reboots server

    await server.close();

    server = await http.createServer(app);
    await server.listen();
    request = await supertest(server);

    await request.get('/v0/mail?mailbox=sent')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(data => {
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
        // Checks if all content is removed
        let found = false;
        for (const mailbox of data.body) {
          for (const email of mailbox['mail']) {
            if (email['id'] == uuid) {
              found = true;
              break;
            }
          }
        }
        expect(found).toBe(true);
      })
  });

  test('PUT E-mail from Inbox to New Mailbox and Back (Reboot)', async () => {
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=new')
      .expect(204)

    // Reboots server

    await server.close();

    server = await http.createServer(app);
    await server.listen();
    request = await supertest(server);

    await request.get('/v0/mail')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      // Checks if all content is removed
      let found = false;
      for (const mailbox of data.body) {
        if (mailbox['name'] == 'new') {
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    })
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=inbox')
    .expect(204)
    // Deletes the new mailbox
    await fs.unlinkSync(dataPath+'new.json');
  });

  test('PUT E-mail Move Back and Forth b/w Inbox & Trash (Reboot)', async () => {
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=trash')
      .expect(204)

    // Reboots server

    await server.close();

    server = await http.createServer(app);
    await server.listen();
    request = await supertest(server);
    
    await request.get('/v0/mail?mailbox=trash')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      // Checks if all content is removed
      let found = false;
      for (const mailbox of data.body) {
        for (const email of mailbox['mail']) {
          if (email['id'] == '591b428e-1b99-4a56-b653-dab17210b3b7') {
            found = true;
            break
          }
        }
      }
      expect(found).toBe(true);
    })
    await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=inbox')
    .expect(204)
  });
});