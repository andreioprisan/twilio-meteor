Twilio Meteor API bindings
==========================

This smart package exposes the official Twilio Meteor API from the node.js npm package: http://twilio.github.io/twilio-node/

This Meteor package is licensed under the MIT license.

This uses version 1.4.0 of the Twilio node.js package and the new meteor 0.6.5.1+ npm bindings.

#### To Install

    mrt add moment
    mrt add twilio-meteor

moment is required for Twilio date conversion internals.

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

####Here are a few examples of how to process incoming Voice calls and SMS messages via the Meteor router.

This code is from a production site, feedvenue.com

twilioRawIn is a collection to store the raw input for later.

```javascript

Meteor.Router.add('/api/twiml/voice', 'POST', function() {
	var rawIn = this.request.body;
	console.log(rawIn);
	if (Object.prototype.toString.call(rawIn) == "[object Object]") {
		twilioRawIn.insert(rawIn);
	}

	var question = {};
	if (rawIn.Body) {
		question.inputQuestion = rawIn.Body;
		question.source = "sms";
	} else if (rawIn.TranscriptionText) {
		question.inputQuestion = rawIn.TranscriptionText;
		question.source = "voicemail";
	} else {
		return;
	}
	question.inputName = rawIn.From;
	    		
	var toOrig = rawIn.To;
	toOrig = toOrig.replace(/\+1/g, "");
	var toPretty = '('+toOrig.substr(0,3)+') '+toOrig.substr(3,3)+'-'+toOrig.substr(6,10);
	var eventDetails = Events.findOne({phone: toPretty});

	if (_.size(eventDetails) == 0) {
		return;
	} else {
		question.slug = eventDetails.slug;
	}

    Meteor.call('questionCreate', question, function(error, res) {

    });

	var xml = '<Response><Say voice="man">Please speak your question after the tone. You may hang up when you\'re finished</Say><Record maxLength="180" transcribe="true" transcribeCallback="https://feedvenue.com/api/twiml/transcribe" /></Response>';
    return [200, {"Content-Type": "text/xml"}, xml];
});


```

```javascript

Meteor.Router.add('/api/twiml/sms', 'POST', function() {
	var rawIn = this.request.body;
	if (Object.prototype.toString.call(rawIn) == "[object Object]") {
		twilioRawIn.insert(rawIn);
	}

	var question = {};
	if (rawIn.Body) {
		question.inputQuestion = rawIn.Body;
		question.source = "sms";
	} else if (rawIn.TranscriptionText) {
		question.inputQuestion = rawIn.TranscriptionText;
		question.source = "voicemail";
	} else {
		return;
	}
	question.inputName = rawIn.From;
	    		
	var toOrig = rawIn.To;
	toOrig = toOrig.replace(/\+1/g, "");
	var toPretty = '('+toOrig.substr(0,3)+') '+toOrig.substr(3,3)+'-'+toOrig.substr(6,10);
	var eventDetails = Events.findOne({phone: toPretty});

	if (_.size(eventDetails) == 0) {
		return;
	} else {
		question.slug = eventDetails.slug;
	}

    Meteor.call('questionCreate', question, function(error, res) {

    });

	var xml = '<Response><Sms>Thank you for submitting your question!</Sms></Response>';
    return [200, {"Content-Type": "text/xml"}, xml];
});

```

```javascript

Meteor.Router.add('/api/twiml/transcribe', 'POST', function() {
	var rawIn = this.request.body;
	if (Object.prototype.toString.call(rawIn) == "[object Object]") {
		twilioRawIn.insert(rawIn);
	}

	var question = {};
	if (rawIn.Body) {
		question.inputQuestion = rawIn.Body;
		question.source = "sms";
	} else if (rawIn.TranscriptionText) {
		question.inputQuestion = rawIn.TranscriptionText;
		question.source = "voicemail";
	} else {
		return;
	}
	question.inputName = rawIn.From;
	    		
	var toOrig = rawIn.To;
	toOrig = toOrig.replace(/\+1/g, "");
	var toPretty = '('+toOrig.substr(0,3)+') '+toOrig.substr(3,3)+'-'+toOrig.substr(6,10);
	var eventDetails = Events.findOne({phone: toPretty});

	if (_.size(eventDetails) == 0) {
		return;
	} else {
		question.slug = eventDetails.slug;
	}

    Meteor.call('questionCreate', question, function(error, res) {

    });

    return [200, {"Content-Type": "application/json"}, "ok"];
});

```

For more examples, check out the official Twilio node.js quickstart section: http://twilio.github.io/twilio-node/#quickstart

