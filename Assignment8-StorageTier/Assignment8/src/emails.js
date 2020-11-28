const db = require('./db');

exports.getMailbox = async (req, res) => {
  const emails = await db.selectMailbox(req.query.mailbox, req.query.from);

  if (emails) {
    res.status(200).json(emails);
  } else {
    res.status(404).send();
  }
};
// exports.getMailbox = async (req, res) => {
//   const emails = await db.selectMailbox(req.query.mailbox);
//   if (emails) {
//     res.status(200).json(emails);
//   } else {
//     res.status(404).send();
//   }
// };

exports.getById = async (req, res) => {
  const row = await db.selectByID(req.params.id);
  // console.log(typeof(email));
  if (row) {
    const email = {
      'id': row['id'],
      'from': row.mail['from'],
      'to': row.mail['to'],
      'subject': row.mail['subject'],
      'sent': row.mail['sent'],
      'received': row.mail['received'],
      'content': row.mail['content'],
    };
    res.status(200).json(email);
  } else {
    res.status(404).send();
  }
};

exports.postEmail = async (req, res) => {
  const newEmail = {}; // req.body;
  newEmail['to'] = req.body['to'];
  newEmail['from'] = {
    'name': 'CSE183 Student',
    'email': 'cse183student@ucsc.edu',
  };
  newEmail['subject'] = req.body['subject'];
  newEmail['content'] = req.body['content'];
  const currentTime = new Date().toISOString();
  newEmail['sent'] = currentTime;
  newEmail['received'] = currentTime;

  const postReturn = await db.insertEmail('sent', newEmail);
  res.status(201).json(postReturn);
};

exports.moveEmail = async (req, res) => {
  const ID = req.params.id;
  const MAILBOX = req.query.mailbox;

  // search for the email given the id
  const row = await db.selectByID(ID);
  if (!row) {
    res.status(404).send();
  // 409 error catch
  } else if (MAILBOX == 'sent' && row['mailbox'] != 'sent') {
    res.status(409).send();
  } else if (MAILBOX == row['mailbox']) {
    // nop need to perform anything if mail already at destination
    res.status(204).send();
  } else {
    // UPDATE the value of mailbox
    await db.updateMailbox(ID, MAILBOX);
    // send a 204
    res.status(204).send();
  }
};
