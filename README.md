![Screenshot](http://itskrish.co/img/work/rep.png)

# Text Your Rep

There's generally a lot of friction in reaching out to your representative in Congress: most ignore contact form submissions (if they have one) and many don't even have publically-accessible email addresses. **They do pay attention to faxes, though.**

The problem is that having to voice our input via fax makes us just keep it to ourselves. If it were easy enough as texting them -- knowing our message would be seen -- we'd be more eager to. 

**This tool lets you text your rep; it takes your text message, figures out who your representative is, and faxes them the message + your phone number in case they'd like to get back to you.**

Congressional data courtesy of [@unitedstates](https://github.com/unitedstates): check out [congress-legislators](https://github.com/unitedstates/congress-legislators)

Made at [CalHacks III](http://calhacks.io).

**Note:** The live version of this (at [itskrish.co/text-your-rep](http://itskrish.co/text-your-rep)) only uses Phaxio's test API key & secret, meaning that the faxes aren't currently being sent (even though Phaxio's corresponding callback runs); if this project receives enough interest, I'll replace the test keys with real ones (although I'd hope someone with more funds would deploy this instead OR just donate to me).

## Setup

If you're trying to set this up on your own, I'd recommend a Heroku deploy. 

A [Twilio](https://twilio.com) account is required, as is a [Phaxio](http://phaxio.com) account.

To run locally, you'll need to have a config.json that looks like the following:

```javascript
{
  "twilio": {
    "accountSid": "YOUR TWILIO ACCOUNT SID",
    "authToken": "YOUR TWILIO AUTH TOKEN"
  },
  "phaxio": {
    "key": "YOUR PHAXIO API KEY",
    "secret": "YOUR PHAXIO API SECRET"
  }
}
```

In a server environment, set the following environment variables:

```
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
PHAXIO_KEY
PHAXIO_SECRET
```

Once you've deployed it to a server, you need to go into your Twilio phone number settings + set your text Webhook to POST to your live URL `/receive-text`; you can then text that specific phone number with the following format:

```
<Your congressional district number>:<Your message for your representative>
```

Upon doing so, your representative will be faxed your message and you'll receive confirmation via text that it happened.

An example of a text for someone living in the 6th congressional district in their state:

```
6:Here's the content of my message. 

It can span multiple lines, paragraphs, etc, or it can be just one long text.

As long as the text starts with the district number followed by a colon.
```
