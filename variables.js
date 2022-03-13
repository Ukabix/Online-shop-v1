// import confidential
// const secret = require('./secret');
// set variables
let mongodbUrl = 'mongodb://127.0.0.1:27017';
let configPass = 'super-secret';
let stripeSk = '';
let portDb = 3000;
let serverUrl = 'http://127.0.0.1:3000';
let port = 3000;

// set env variables
if (process.env.MONGODB_URL) {
  mongodbUrl = process.env.MONGODB_URL;
}
if (process.env.CONFIG_PASS) {
  configPass = process.env.CONFIG_PASS;
}
if (process.env.STRIPE_SK) {
  stripeSk = process.env.STRIPE_SK;
}
if (process.env.PORT) {
  port = process.env.PORT;
}
if (process.env.SERVER_URL) {
  serverUrl = process.env.SERVER_URL
}


// integrations
let stripeSuccessUrl= serverUrl + '/orders/success';
let stripeCancelUrl= serverUrl + '/orders/failure';

module.exports = {
  stripeSk: stripeSk,
  mongodbUrl: mongodbUrl,
  configPass: configPass,
  portDb: portDb,
  serverUrl: serverUrl,
  stripeSuccessUrl: stripeSuccessUrl,
  stripeCancelUrl: stripeCancelUrl,
  port: port
}