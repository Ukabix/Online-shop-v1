// import env
const env = require('../variables');
// import mongo
const mongodb = require('mongodb');
// call mongo client
const MongoClient = mongodb.MongoClient;


let database;

async function connectToDatabase () {
  // connect to mongo
  const client = await MongoClient.connect(env.mongodbUrl);
  // use db in mongo
  database = client.db('online-shop');
}

function getDB() {
  // catch error for no connection to mongo
  if(!database) {
    throw new Error('No connection to database!');
  }
  return database;
}

// exports
module.exports = {
  connectToDatabase: connectToDatabase,
  getDB: getDB,
}