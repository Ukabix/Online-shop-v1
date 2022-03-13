// import env
const env = require('../variables');
// import express session
const expressSession = require('express-session');
// import mongodb session package
const mongoDBStore = require('connect-mongodb-session');

function createSessionStore() {
  // call mongoDbStore, forward session
  const MongoDBStore = mongoDBStore(expressSession);
  // create MongoDbStore object to hold session data
  const store = new MongoDBStore({
    uri: env.mongodbUrl,
    databaseName: 'online-shop',
    collection: 'sessions'
  });
  // return stored data
  return store;
}

function createSessionConfig() {
  // return config object
  return {
    secret: env.configPass,
    resave: false,
    saveUninitialized: false,
    // pass store object
    store: createSessionStore(),
    // cookie settings
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 10e3
    }
  };
}

module.exports = createSessionConfig;