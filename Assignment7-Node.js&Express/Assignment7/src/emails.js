const fs = require('fs');
// const fsPromises = fs.promises;

// Populate Mailboxes at server start
const allMailboxes = {};
const dataFiles = fs.readdirSync('./data/', {withFileTypes: true});

for (const file of dataFiles) {
  // Regex to remove file extension from JS string. https://bit.ly/3kMT4Uu
  allMailboxes[file.name.replace(/\.[^/.]+$/, '')] =
   JSON.parse(fs.readFileSync('./data/' + file.name));
}

// exports.updateMap = async () => {
//   // console.log('UPDATING MAP');
//   fs.readdirSync('./data').forEach((file) => {
//     const fileName = file.slice(0, -5);
//     allMailboxes[fileName] = JSON.parse(fs.readFileSync('./data/' + file));
//   });
//   // console.log(Object.keys(allMailboxes));
// };

exports.getMailbox = async (req, res) => {
  const data = [];

  const mailboxQuery = req.query.mailbox;

  if (mailboxQuery == undefined) {
    // Return all mailboxes
    // for every email in every mailbox
    for (const [key, value] of Object.entries(allMailboxes)) {
      const mail = [];
      // copy email objects
      value.forEach((email) => {
        mail.push({
          'id': email['id'],
          'to-name': email['to-name'],
          'to-email': email['to-email'],
          'from-name': email['from-name'],
          'from-email': email['from-email'],
          'subject': email['subject'],
        });
      });
      // add to the return array
      data.push({
        name: key,
        mail: mail,
      });
    }
  } else {
    // Return just the one mailbox
    const mailbox = allMailboxes[mailboxQuery];

    if (mailbox == undefined) {
      res.status(404).send();
      return;
    } else {
      const mail = [];
      mailbox.forEach((email) => {
        mail.push({
          'id': email['id'],
          'to-name': email['to-name'],
          'to-email': email['to-email'],
          'from-name': email['from-name'],
          'from-email': email['from-email'],
          'subject': email['subject'],
        });
      });
      data.push({
        name: req.query['mailbox'],
        mail: mail,
      });
    }
  }
  // res.status(200).send(JSON.stringify(retArr, null, 2));
  return res.status(200).json(data);
};

exports.getById = async (req, res) => {
  // Iterates through every email
  for (const value of Object.values(allMailboxes)) {
    const email = value.find((email) => email.id == req.params.id);
    if (email) {
      res.status(200).json(email);
      return;
    }
  }

  // Object.keys(allMailboxes).forEach((key) => {
  //   const mailbox = allMailboxes[key];
  //   const email = mailbox.find((email) => email.id == req.params.id);
  //   if (email) {
  //     res.status(200).json(email);
  //     return;
  //   }
  // });
  res.status(404).send();
};

exports.postEmail = async (req, res) => {
  const newEmail = {}; // req.body;
  // https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
  newEmail['id'] = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
  );
  newEmail['to-name'] = req.body['to-name'];
  newEmail['to-email'] = req.body['to-email'];
  newEmail['from-name'] = 'CSE183 Student';
  newEmail['from-email'] = 'cse183-student@ucsc.edu';
  newEmail['subject'] = req.body['subject'];
  newEmail['received'] = req.body['received'];
  newEmail['content'] = req.body['content'];

  // push locally
  allMailboxes['sent'].push(newEmail);

  fs.writeFileSync(
      './data/sent.json',
      JSON.stringify(allMailboxes['sent'], null, 2),
  );

  res.status(201).send(newEmail);
};

exports.moveEmail = async (req, res) => {
  for (const [key, value] of Object.entries(allMailboxes)) {
    // index mail objects for deletion
    let removeIndex = 0;
    for (const email of value) {
      if (email['id'] === req.params.id) {
        // IF destination = sent && not already in sent
        if ((req.query['mailbox'] == 'sent') && (key != 'sent')) {
          res.status(409).send();
          return;
        }

        // IF mailbox DNE, create it
        if (allMailboxes[req.query.mailbox] === undefined) {
          allMailboxes[req.query.mailbox] = [];
        }
        allMailboxes[req.query.mailbox].push(email);

        // Delete mail obj in the source
        allMailboxes[key].splice(removeIndex, 1);

        // Write changes to destination and source files
        fs.writeFileSync('./data/'+req.query['mailbox']+'.json',
            JSON.stringify(allMailboxes[req.query['mailbox']], null, 2));

        fs.writeFileSync('./data/'+key+'.json',
            JSON.stringify(allMailboxes[key], null, 2));

        res.status(204).send();
        return;
      }
      removeIndex++;
    }
  }
  res.status(404).send();
};
