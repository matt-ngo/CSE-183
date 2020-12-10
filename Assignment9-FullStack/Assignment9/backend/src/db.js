/*
  SOURCES
  23.Authentication
*/
const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

/*
 * Authentication: get users from database
 */
exports.getusers = async () => {
  const select = 'SELECT * FROM users';
  const query = {
    text: select,
    values: [],
  };
  const {rows} = await pool.query(query);

  const usersData = [];
  for (const row of rows) {
    usersData.push(row);
  }
  return usersData;
};

/*
 * Query:
 *    - select all properties of emails from the user
 *    - append 'starred' query param if specified
 *    - Order descending based on received time
 */
exports.selectEmails = async (user, mailbox) => {
  // format query
  let select = `SELECT id, mailbox, unread, starred, avatar, mail FROM emails`;
  select += ` WHERE (username = '${user}')`;
  if (mailbox == 'Starred') {
    select += ` AND (starred = True)`;
  } else {
    select += ` AND (mailbox = '${mailbox}')`;
  }
  select += ` ORDER BY mail->>'received' DESC`;
  const query = {
    text: select,
    values: [],
  };
  const {rows} = await pool.query(query);

  const mailboxesData = [];
  for (const row of rows) {
    mailboxesData.push(row);
  }
  return mailboxesData;
};

exports.toggleStarred = async (id, starred) => {
  const update = 'UPDATE emails SET starred = $1 WHERE id = $2 RETURNING *';
  const query = {
    text: update,
    values: [`${!starred}`, `${id}`],
  };
  await pool.query(query);
  // console.log('id: ', id);
  return;
};

exports.setRead = async (id, read) => {
  const update = 'UPDATE emails SET unread = $1 WHERE id = $2 RETURNING *';
  const query = {
    text: update,
    values: [`${read}`, `${id}`],
  };
  await pool.query(query);
  // console.log('unread = ', rows[0].unread);
  return;
};

exports.searchEmails = async (user, substr) => {
  // format query
  let select = `SELECT id, mailbox, unread, starred, avatar, mail FROM emails`;
  select += ` WHERE (username = '${user}')`;
  // subjects
  select += ` AND (mail->>'subject' ~* $1`;
  // senders
  select += ` OR mail->'from'->>'name' ~* $1`;
  select += ` OR mail->'to'->>'name' ~* $1`;
  // contents
  select += ` OR mail->>'content' ~* $1)`;

  select += ` ORDER BY mail->>'received' DESC`;
  const query = {
    text: select,
    values: [substr],
  };
  const {rows} = await pool.query(query);

  const mailboxesData = [];
  for (const row of rows) {
    mailboxesData.push(row);
  }
  return mailboxesData;
};

exports.insertEmail = async (username, mail) => {
  let insert = `INSERT INTO emails(username, mailbox, starred, unread, mail)`;
  insert += ` VALUES ($1, 'Sent', False, True, $2)`;
  insert += ` RETURNING *`;
  const query = {
    text: insert,
    values: [username, mail],
  };
  await pool.query(query);
  // console.log(rows[0]);
  return;
};

exports.getUnread = async (mailbox, user) => {
  let select;
  let valueArr = [];
  if (mailbox === 'Starred') {
    select = `SELECT COUNT(starred) FROM emails WHERE 
      (username = $1 AND starred = True)`;
    valueArr = [`${user}`];
  } else {
    select = `SELECT COUNT(unread) FROM emails WHERE 
      (username = $1 AND mailbox = $2 AND unread = True)`;
    valueArr = [`${user}`, `${mailbox}`];
  }
  const query = {
    text: select,
    values: valueArr,
  };
  const {rows} = await pool.query(query);
  // console.log('rows: ', rows);
  return parseInt(rows[0].count);
};

