/*
  SOURCES
  23.Authentication
*/
const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const auth = require('./auth');
const emails = require('./emails');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.safeLoad(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

// route to authenticate username + password
app.post('/authenticate', auth.authenticate);
// route to periodically verify JWT
app.post('/verify', auth.verify);

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);

// Your routes go here
app.get('/emails/:user/:mailbox', auth.check, emails.getMailbox);
app.get('/emails/search/:user/:queryString', auth.check, emails.findEmails);
app.get('/countUnread/:user', auth.check, emails.countUnread);
app.post('/starred/:id', auth.check, emails.toggleStarred);
app.post('/read/:id', auth.check, emails.setRead);
app.post('/unread/:id', auth.check, emails.setUnread);
app.post('/send', auth.check, emails.sendEmail);


app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
