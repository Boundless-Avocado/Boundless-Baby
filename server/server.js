var express = require('express');
var keys = require('./keys');
var utils = require('./config/utils')

var app = express();

var port = process.env.PORT;

app.listen(port);

console.log('Server now listening on port ' + port);

// configure our server with all the middleware and and routing
//require('./config/middleware.js')(app, express);

// export our app for testing and flexibility, required by index.js
module.exports = app;

// var client = require('twilio')(keys.accountSid, keys.authToken);
 
// client.messages.create({
//     body: "Twilio is my bitch",
//     to: "+14157062795",
//     from: "+14158149655"
// }, function(err, message) {
//     process.stdout.write(message.sid);
// });

var sendgrid = require("sendgrid")(keys.api_user, keys.api_key);
var email = new sendgrid.Email();

email.addTo("mdelucco@gmail.com");
email.setFrom("david@dsernst.com");
email.setSubject("Sending with SendGrid is Fun");
email.setHtml("and easy to do anywhere, even with Node.js");

sendgrid.send(email);

/* Walkthrough of the server

  Express and our server are initialized here.
  Next, we then inject our server and express into our config/middlware.js file for setup.
  We also exported our server for easy testing, it is then started in index.js

  middleware.js requires all express middlware and sets it up
  Our authentication is set up there as well
  We also create individual routers for our two main features, links and users
  each feature has it's own folder with a model, controller, and route file
    the respective file is required in middlware.js and injected with its mini router
    that route file then requires the respective controller and sets up all the routes
    that controller then requires the respective model and sets up all our endpoints which respond to request

*/
