Package.describe({
  summary: "Twilio API Wrapper for Meteor"
});

Npm.depends({ "twilio": "1.6.0" });

Package.on_use(function(api) {
  if (api.export) api.export('Twilio', 'server');	
  api.add_files('twilio_npm.js', 'server');
});

