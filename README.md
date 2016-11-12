# Text Your Rep

There's generally a lot of friction in reaching out to your representative in Congress: most ignore contact form submissions (if they have one) and many don't even have publically-accessible email addresses. **They do pay attention to faxes, though.**

The problem lies in the fact that having to voice our input via fax is often enough to compel us to keep it to ourselves. If it were easy enough as texting our reps, knowing our message would be seen, we'd be more eager to. 

**This tool lets you text your rep; it takes your text message, figures out who your representative is, and faxes them the message + your phone number in case they'd like to get back to you.**

Made at [CalHacks III](http://calhacks.io).

Congressional data courtesy of [@unitedstates](https://github.com/unitedstates): check out [congress-legislators](https://github.com/unitedstates/congress-legislators)

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
6:Here's the content of my message. It can span multiple lines, paragraphs, etc, or it can be just one long text. As long as the text starts with the district number followed by a colon.
```