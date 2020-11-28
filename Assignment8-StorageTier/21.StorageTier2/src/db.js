const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

/*
  If the author query parameter was sent to us, use it to
  restrict the query  by doing a case insensitive wildcard 
  search against json column

  Otherwise select and return all the books
*/
exports.selectBooks = async (author) => {
  let select = 'SELECT book FROM book';
  if (author) {
    select += ` WHERE book->>'author' ~* $1`
  }
  const query = {
    text: select,
    values: author ? [ `${author}` ] : [ ]
  };
  const { rows } = await pool.query(query);
  const books = [];
  for (const row of rows) {
    books.push(row.book);
  }
  return books;
}

/*
  Select a single book by its ISBN
  ISBN's are the book table's primary key so we can use
  a standard SQL SELECT
*/
exports.selectBook = async (isbn) => {
  const select = 'SELECT book FROM book WHERE isbn = $1';
  const query = {
    text: select,
    values: [ isbn ]
  };
  const { rows } = await pool.query(query);
  return rows.length == 1 ? rows[0].book : undefined;
}

/*
  Insert a new row (tuple) into the book table
*/
exports.insertBook = async (book) => {
  const insert = 'INSERT INTO book(isbn, book) VALUES ($1, $2)';
  const query = {
    text: insert,
    values: [ book.isbn, book ]
  };
  await pool.query(query);
}


console.log(`Connected to database '${process.env.POSTGRES_DB}'`)

