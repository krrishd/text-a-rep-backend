'use strict';

let twilio = require('twilio');

let accountSid = 
  process.env.TWILIO_ACCOUNT_SID ||
  require('./config.json').twilio.accountSid;

let authToken = 
  process.env.TWILIO_AUTH_TOKEN ||
  require('./config.json').twilio.authToken;

let client = new twilio.RestClient(accountSid, authToken);

function handleText(req, res) {
  console.log('Received a text');
  console.dir(req.body);
}

module.exports = handleText;






