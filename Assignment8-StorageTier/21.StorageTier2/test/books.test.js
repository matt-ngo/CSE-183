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

test('GET Invalid URL', async () => {
  await request.get('/v0/bookie-wookie/')
    .expect(404)
});

test('GET All', async () => {
  await request.get('/v0/books')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toEqual(256);
    })
});

test('GET One', async () => {
  await request.get('/v0/books/4987331179')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.isbn).toBeDefined();
      expect(res.body.isbn).toEqual('4987331179');
      expect(res.body.author).toEqual('Zelig Nizet');
      expect(res.body.title).toEqual('Across the Bridge');
      expect(res.body.publisher).toEqual('HarrisMcDermott');
    })
});

test('GET Missing', async () => {
  await request.get('/v0/books/4987331166')
    .expect(404)
});

test('GET Invalid ISBN ', async () => {
  await request.get('/v0/books/4987331178-1')
    .expect(400)
});

const book = { 
  isbn: '4987331178',
  author: 'Bob Dylan',
  title: 'Mumble Mumble',
  publisher: 'McDermit Smith Wilson'
};

test('POST New', async () => {
  await request.post('/v0/books/')
    .send(book)
    .expect(201)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.isbn).toBeDefined();
      expect(res.body.isbn).toEqual(book.isbn);
      expect(res.body.author).toEqual(book.author);
      expect(res.body.title).toEqual(book.title);
      expect(res.body.publisher).toEqual(book.publisher);
    })
});

test('GET After POST', async () => {
  await request.get('/v0/books/' + book.isbn)
    .expect(200)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.isbn).toBeDefined();
      expect(res.body.isbn).toEqual(book.isbn);
      expect(res.body.author).toEqual(book.author);
      expect(res.body.title).toEqual(book.title);
      expect(res.body.publisher).toEqual(book.publisher);
    })
});

test('POST Invalid ISBN', async () => {
  book.isbn = 'some-old-guff';
  await request.post('/v0/books/')
    .send(book)
    .expect(400)
});

test('POST Exisiting ISBN', async () => {
  book.isbn = '4987331179';
  await request.post('/v0/books/')
    .send(book)
    .expect(409)
});


