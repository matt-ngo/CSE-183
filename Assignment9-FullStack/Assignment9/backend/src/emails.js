const db = require('./db');

exports.getMailbox = async (req, res) => {
  const emails = await db.selectEmails(req.params.user, req.params.mailbox);
  res.status(200).json(emails);
};

exports.findEmails = async (req, res) => {
  const emails = await db.searchEmails(req.params.user, req.params.queryString);
  res.status(200).json(emails);
};

exports.toggleStarred = async (req, res) => {
  const {starred} = req.body;
  await db.toggleStarred(req.params.id, starred);
  res.sendStatus(200);
};

exports.setRead = async (req, res) => {
  // console.log('UNREAD');
  await db.setRead(req.params.id, false);
  res.sendStatus(200);
};

exports.setUnread = async (req, res) => {
  // console.log('READ');
  await db.setRead(req.params.id, true);
  res.sendStatus(200);
};

exports.newMailbox = async (req, res) => {
  const {name} = req.body;
  await db.postNewMailbox(name, req.params.user);
  return res.sendStatus(200);
};

exports.sendEmail = async (req, res) => {
  const newEmail = {}; // req.body;
  // // console.log('HERE');
  // console.log(req.body);
  newEmail['to'] = req.body['to'];
  newEmail['from'] = req.body['from'];
  newEmail['subject'] = req.body['subject'];
  newEmail['content'] = req.body['content'];
  const currentTime = new Date().toISOString().split('.')[0]+'Z';
  newEmail['sent'] = currentTime;
  newEmail['received'] = currentTime;
  const username = newEmail['from'].email;
  await db.insertEmail(username, newEmail);
  res.status(201);
};

exports.countUnread = async (req, res) => {
  // console.log('HERE');
  const inbox = await db.getUnread('Inbox', req.params.user);
  const starred = await db.getUnread('Starred', req.params.user);
  const sent = await db.getUnread('Sent', req.params.user);
  const drafts = await db.getUnread('Drafts', req.params.user);
  const trash = await db.getUnread('Trash', req.params.user);

  const countArr = [inbox, starred, sent, drafts, trash];
  // console.log('arr: ', countArr, typeof(countArr));

  res.status(200).json(countArr);
};
