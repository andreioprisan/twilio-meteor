Twilio Meteor API bindings
==========================

This smart package exposes the official Twilio Meteor API from the node.js npm package: http://twilio.github.io/twilio-node/

This uses version 1.1.0 of the Twilio node.js package and the new meteor 0.6.0 npm bindings.

To get started, replace ACCOUNT_SID, AUTH_TOKEN with your Twilio credentials and use some of the examples below:

####Send an SMS text message

```javascript

  twilio = Twilio(ACCOUNT_SID, AUTH_TOKEN);
  twilio.sendSms({
    to:'+16515556677', // Any number Twilio can deliver to
    from: '+14506667788', // A number you bought from Twilio and can use for outbound communication
    body: 'word to your mother.' // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (!err) { // "err" is an error received during the request, if any
      // "responseData" is a JavaScript object containing data received from Twilio.
      // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
      // http://www.twilio.com/docs/api/rest/sending-sms#example-1
      console.log(responseData.from); // outputs "+14506667788"
      console.log(responseData.body); // outputs "word to your mother."
    }
});


```

####Place a phone call, and respond with TwiML instructions from the given URL

```javascript
  twilio = Twilio(ACCOUNT_SID, AUTH_TOKEN);
  twilio.makeCall({
    to:'+16515556677', // Any number Twilio can call
    from: '+14506667788', // A number you bought from Twilio and can use for outbound communication
    url: 'http://www.example.com/twiml.xml' // A URL that produces an XML document (TwiML) which contains instructions for the call
  }, function(err, responseData) {
    //executed when the call has been initiated.
    console.log(responseData.from); // outputs "+14506667788"
  });


```
  
####Loop through a list of SMS messages sent from a given number

```javascript

  twilio = Twilio(ACCOUNT_SID, AUTH_TOKEN);
  twilio.listSms({
    from:'+16512223333'
  }, function (err, responseData) {
    responseData.smsMessages.forEach(function(message) {
        console.log('Message sent on: '+message.dateCreated.toLocaleDateString());
        console.log(message.body);
    });
  });


```


For more examples, check out the official Twilio node.js quickstart section: http://twilio.github.io/twilio-node/#quickstart

