Package.describe({
  summary: "Twilio API Wrapper for Meteor"
});

Npm.depends({ "twilio": "1.1.0" });

Package.on_use(function(api) {
  api.add_files('twilio_npm.js', 'server');
});

