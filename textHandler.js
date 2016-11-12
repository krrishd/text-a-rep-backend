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

  res.status(200).send();

  let initialInput = {
    stateOfSender: req.body.FromState,
    phoneNumberOfSender: req.body.From,
    phoneNumberOfRecipient: req.body.To,
    contentOfText: req.body.Body
  };

  // Syntax of a text would be: "<District Number>:<Content of message>"
  
  let district = Number(initialInput
    .contentOfText
    .split(':')[0]);

  let messageTokens = initialInput
    .contentOfText.split(':');

  let message = messageTokens
    .slice(1, messageTokens.length)
    .join(':');

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
    let messageContent =
      'Dear Rep. '
      + rep.name + ',\n\n' +
      'The following is a message to you from ' + 
      initialInput.phoneNumberOfSender + ':\n\n' +
      message;

    let faxableMessage = 
      '<!DOCTYPE html><html><head></head><body><p style="font-family: serif;' +
      'font-size: 15pt;' +
      'white-space: pre;' +
      'padding: 10px">' + messageContent
       + '</p></body></html>';

    let repFaxNumberSanitized = '1' + rep.fax.replace(/-/g, '');

    phaxioClient.sendFax({
      to: repFaxNumberSanitized,
      string_data: faxableMessage,
      string_data_type: 'html'
    }, (faxErr, faxRes) => {
      faxesSent++;
      if (faxesSent == relevantRepsCondensed.length) {
        twilioClient.sendMessage({
          to: initialInput.phoneNumberOfSender,
          from: initialInput.phoneNumberOfRecipient,
          body: ('Congrats! The following was just sent to your representative via fax:\n\n"' + faxableMessage + '"') 
        }, (err, responseData) => {
          if (!err) {

          }
        });
      }
    });
  });
}

module.exports = handleText;
