/*
  SOURCES
  23.Authentication
*/
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secrets = require('../data/secrets');
const db = require('./db');

exports.authenticate = async (req, res) => {
  const {email, password} = req.body;
  const users = await db.getusers();
  const user = users.find((user) => {
    return user.email === email &&
    bcrypt.compareSync(password, user.password);
  });

  if (user) {
    // init(); // try to populate db with recent vals

    const accessToken = jwt.sign(
        {email: user.email},
        secrets.accessToken, {
          expiresIn: '10m',
          algorithm: 'HS256',
        });

    res.json({
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      avatar: user.avatar,
      show_avatar: user.show_avatar,
    });
  } else {
    res.status(401).send('Username or password incorrect');
  }
};

exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secrets.accessToken, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

exports.verify = (req, res) => {
  const {accessToken} = req.body;
  jwt.verify(accessToken, secrets.accessToken, (err, token) => {
    if (err) {
      res.status(200).json({verified: false});
      return;
    }
    res.status(200).json({verified: true});
  });
};
