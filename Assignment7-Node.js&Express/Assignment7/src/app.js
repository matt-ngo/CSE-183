const express = require('express');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const emails = require('./emails');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.safeLoad(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);

emails.updateMap();

// Your routes go here
// - GET /v0/mail
// - GET /v0/mail?mailbox={mailbox}
app.get('/v0/mail', emails.getMailbox);
// - GET /v0/mail/{id}
app.get('/v0/mail/:id', emails.getById);
// - POST /v0/mail
app.post('/v0/mail', emails.postEmail);
// - PUT /v0/mail/{id}?mailbox={mailbox}
app.put('/v0/mail/:id', emails.moveEmail);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
