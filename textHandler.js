'use strict';

let twilio = require('twilio');

let accountSid = 
  process.env.TWILIO_ACCOUNT_SID ||
  require('./config.json').twilio.accountSid;

let authToken = 
  process.env.TWILIO_AUTH_TOKEN ||
  require('./config.json').twilio.authToken;

let twilioClient = new twilio.RestClient(accountSid, authToken);

let Phaxio = require('phaxio');

let phaxioKey = 
  process.env.PHAXIO_KEY ||
  require('./config.json').phaxio.key;

let phaxioSecret =
  process.env.PHAXIO_SECRET ||
  require('./config.json').phaxio.secret;

let phaxioClient = new Phaxio(phaxioKey, phaxioSecret);

let congressData = require('./getCongressData');

function handleText(req, res) {

  res.send('Got the text!');

  let initialInput = {
    stateOfSender: req.body.fromState,
    phoneNumberOfSender: req.body.From,
    phoneNumberOfRecipient: req.body.To,
    contentOfText: req.body.Body
  };

  // Syntax of a text would be: "<District Number>:<Content of message>"

  let district = initialInput
    .contentOfText
    .split(':')[0];

  let message = initialInput
    .contentOfText.split(':')
    .splice(0,1)
    .join();

  let relevantReps = congressData
    .findByStateAndDistrict(
      congressData.rawDataAsJSON,
      initialInput.stateOfSender,
      district);

  let relevantRepsCondensed = relevantReps
    .map(rep => {
      return congressData.getRepNameAndFaxNumber(rep);
    });


  let faxesSent = 0;

  relevantRepsCondensed.forEach(rep => {
    let faxableMessage = 'Dear Rep. '
      + rep.name + ',\n\n' +
      'The following is a message to you from ' + 
      initialInput.phoneNumberOfSender + ':\n\n' +
      message;

    let repFaxNumberSanitized = '1' + rep.fax.replace(/-/g, '');

    console.log('Sending fax to ' + repFaxNumberSanitized);

    phaxio.sendFax({
      to: repFaxNumberSanitized,
      string_data: faxableMessage,
      string_data_type: 'text'
    }, () => {
      faxesSent++;
      if (faxesSent == relevantRepsCondensed.length) {
        console.log('Faxes sent!');
        twilioClient.sendMessage({
          to: initialInput.phoneNumberOfSender,
          from: phoneNumberOfRecipient,
          body: ('Congrats! The following was just sent to your reps:\n' + faxableMessage) 
        }, (err, responseData) => {
          if (!err) {
            
          }
        });
      }
    });
  });
}

module.exports = handleText;






