'use strict';

const express       = require('express');
const winston       = require('winston');
const helmet        = require('helmet');
const nodeProxy     = require('./node-proxy');
const nodeAppServer = require('./node-app-server');
const appRealTime   = require('./app-real-time');
const appRoutes     = require('./app-routes');
const authPassport  = require('./auth-passport');
const bodyParser    = require('body-parser');
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors          = require('cors');

const app           = express();
const PORT          = process.env.PORT || 8080;

// In-memory database of chat server users
const users = {};

// enable securit helpers
app.use(helmet());

// in dev enable CORS
if (process.env.NODE_ENV !== 'production') {
  console.log('Dev mode: disabling CORS');
  app.use(cors({
    origin: `http://localhost:${PORT}`,
    credentials: true,
  }));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  (username, password, done) => {
    authPassport.authenticateUser(username, username, password, users)
      .then(
        res => done(null, res),
        msg => done(null, false, message));
  }));

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser(
  (id, done) => done(null, authPassport.getUserById(id, users)));

app.post('/api/auth/login',
  passport.authenticate('local'),
  (req, res) => {
    res.status(200).send(JSON.stringify(req.user));
  }
);

appRoutes(app, users);

// API proxy logic: if you need to talk to a remote server from your client-side
// app you can proxy it though here by editing ./proxy-config.js
nodeProxy(app);

// Serve the distributed assets and allow HTML5 mode routing. NB: must be last.
nodeAppServer(app);

// Start up the server.
const server = app.listen(PORT, (err) => {
  if (err) {
    winston.error(err);
    return;
  }

  winston.info(`Listening on port ${PORT}`);
});

const io = require('socket.io')(server);

// Start the realtime engine
appRealTime(app, io);
