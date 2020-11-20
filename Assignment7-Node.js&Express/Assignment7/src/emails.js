const fs = require('fs');
const fsPromises = fs.promises;
const inbox = require('../data/inbox.json');
const sent = require('../data/sent.json');
const trash = require('../data/trash.json');

const allMailboxes = {
  inbox: inbox,
  sent: sent,
  trash: trash,
};

exports.updateMap = async () => {
  // console.log('UPDATING MAP');
  fs.readdirSync('./data').forEach((file) => {
    const fileName = file.slice(0, -5);
    allMailboxes[fileName] = JSON.parse(fs.readFileSync('./data/' + file));
  });
  // console.log(Object.keys(allMailboxes));
};

exports.getMailbox = async (req, res) => {
  const retArr = [];

  const mailboxQuery = req.query.mailbox;
  // Return all mailbox
  if (mailboxQuery == undefined) {
    Object.keys(allMailboxes).forEach((key) => {
      const mailbox = allMailboxes[key];
      const currentMailBox = {};
      const emails = [];
      mailbox.forEach((obj) => {
        const copy = Object.assign({}, obj);
        delete copy.content;
        emails.push(copy);
      });

      currentMailBox['name'] = key;
      currentMailBox['mail'] = emails;
      retArr.push(currentMailBox);
    });
    // Return just the one mailbox
  } else {
    const currentMailBox = {};
    const emails = [];
    const mailbox = allMailboxes[mailboxQuery];

    if (mailbox == undefined) {
      res.status(404).send();
      return;
    } else {
      mailbox.forEach((obj) => {
        const copy = Object.assign({}, obj);
        delete copy.content;
        emails.push(copy);
      });

      emails.forEach((obj) => {
        delete obj.content;
      });

      currentMailBox['name'] = mailboxQuery;
      currentMailBox['mail'] = emails;
      retArr.push(currentMailBox);
    }
  }
  res.status(200).send(JSON.stringify(retArr, null, 2));
};

exports.getById = async (req, res) => {
  Object.keys(allMailboxes).forEach((key) => {
    const mailbox = allMailboxes[key];
    const email = mailbox.find((email) => email.id == req.params.id);
    if (email) {
      res.status(200).json(email);
      return;
    }
  });
  res.status(404).send();
};

exports.postEmail = async (req, res) => {
  let count = 0;
  Object.keys(req.body).forEach((key) => count++);

  const newEmail = req.body;
  // https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
  newEmail['id'] = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
  );
  newEmail['from-name'] = 'CSE183 Student';
  newEmail['from-email'] = 'cse183-student@ucsc.edu';
  sent.push(newEmail);

  const fileName = './data/sent.json';
  fs.writeFileSync(fileName, JSON.stringify(sent, null, 2));

  res.status(201).send(newEmail);
};

exports.moveEmail = async (req, res) => {
  const destMailbox = req.query.mailbox;

  // search for the email id in existing inboxes
  let found = false;
  let foundEmail = undefined;
  let sourceMailbox = undefined;

  Object.keys(allMailboxes).forEach((key) => {
    const currMailbox = allMailboxes[key];
    const email = currMailbox.find((email) => email.id == req.params.id);
    if (email) {
      // email was already where it was supposed to be
      if (key == destMailbox) {
        res.status(204).json(email);
        return;
      }
      found = true;
      foundEmail = email;
      sourceMailbox = key;
    }
  });

  if (!found) {
    res.status(404).send();
    return;
  }

  // If mailbox dne in the local map: create it, add new object to the map
  if (allMailboxes[destMailbox] == undefined) {
    const pathname = './data/' + destMailbox + '.json';

    fs.writeFileSync(pathname, '[]');

    allMailboxes[destMailbox] = JSON.parse(fs.readFileSync(pathname));
  }

  //  if found and dest = sent and source != sent, 409
  if (found && destMailbox == 'sent' && sourceMailbox != 'sent') {
    res.status(409).send();
    return;
  }

  //  push email locally
  allMailboxes[destMailbox].push(foundEmail);

  //  delete it locally
  const removeIndex = allMailboxes[sourceMailbox]
      .map(function(item) {
        return item.id;
      })
      .indexOf(foundEmail.id);
  allMailboxes[sourceMailbox].splice(removeIndex, 1);

  // rewrite destination
  const dfileName = './data/' + destMailbox + '.json';
  await fsPromises.writeFile(
      dfileName,
      JSON.stringify(allMailboxes[destMailbox], null, 2),
  );
  // rewrite source
  const sfileName = './data/' + sourceMailbox + '.json';
  await fsPromises.writeFile(
      sfileName,
      JSON.stringify(allMailboxes[sourceMailbox], null, 2),
  );

  res.status(204).json(foundEmail);
};
