const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectMailbox = async (mailbox, from) => {
  let select = 'SELECT id, mailbox, mail FROM mail';

  let valueArr = [];
  if (mailbox && !from) {
    select += ` WHERE mailbox = $1`;
    valueArr = [`${mailbox}`];
  } else if (from && !mailbox) {
    select += ` WHERE mail->'from'->>'name' ~* $1`;
    select += ` OR mail->'from'->>'email' ~* $1`;
    valueArr = [`${from}`];
  } else if (from && mailbox) {
    select += ` WHERE mailbox = $1 AND (mail->'from'->>'name' ~* $2`;
    select += ` OR mail->'from'->>'email' ~* $2)`;
    valueArr = [`${mailbox}`, `${from}`];
  }
  const query = {
    text: select,
    values: valueArr,
  };
  const {rows} = await pool.query(query);
  if (rows.length == 0 && !from) {
    return undefined;
  } else {
    const mailboxesData = [];
    // create map keyed by mailbox name
    // mailbox name: [mail objects]
    const map = new Map();
    for (const row of rows) {
      // look up mailbox array in map
      // if dne, create it and insert in map
      if (map.get(row.mailbox) == undefined) {
        map.set(row.mailbox, []);
      }
      // (set the id of the mail to be the row id)
      row.mail.id = row.id;
      // insert mail into mailbox array
      map.get(row.mailbox).push({
        id: row.mail['id'],
        from: row.mail['from'],
        to: row.mail['to'],
        subject: row.mail['subject'],
        sent: row.mail['sent'],
        received: row.mail['received'],
      });
    }
    // for each key in map
    // create named mailbox obj in mailboxes array
    for (const [key, value] of map.entries()) {
      mailboxesData.push({
        name: key,
        mail: value,
      });
    }
    return mailboxesData;
  }
};

exports.selectByID = async (id) => {
  const select = `SELECT id, mailbox, mail FROM mail WHERE id = $1`;
  // const select = 'SELECT book FROM book WHERE isbn = $1';
  const query = {
    text: select,
    values: [`${id}`],
  };
  const {rows} = await pool.query(query);
  if (rows.length != 1) {
    return undefined;
  } else {
    // console.log(rows[0]);
    return rows[0];
  }
};

exports.insertEmail = async (mailbox, mail) => {
  const insert = 'INSERT INTO mail(mailbox, mail) VALUES ($1, $2) RETURNING *';
  const query = {
    text: insert,
    values: [mailbox, mail],
  };
  const {rows} = await pool.query(query);
  return rows[0];
};

exports.updateMailbox = async (id, mailbox) => {
  const update = 'UPDATE mail SET mailbox = $1 WHERE id = $2 RETURNING *';
  const query = {
    text: update,
    values: [mailbox, id],
  };
  const {rows} = await pool.query(query);
  // console.log(rows);
  return rows[0];
};

console.log(`Connected to database '${process.env.POSTGRES_DB}'`);
