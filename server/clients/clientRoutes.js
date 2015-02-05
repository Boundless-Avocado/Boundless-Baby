var groupController = require('../groups/groupController.js');
var userController = require('../users/userController.js');
var multiparty = require('multiparty');
var clients = require('./clientController.js')

module.exports = function (app) {
  app.post('/twilio', function (req, res){
    userController.findByPhone(req.body.From.slice(2), function (user) {
      req.user = user;
      if(req.user){
        if (req.body.Body.slice(0,5).toUpperCase() === "JOIN ") {
          groupController.find(req.body.Body.slice(5), function (group) {
            req.group = group;
            req.body.username = user.username;
            groupController.join(req, res);
          });

        } else if (req.body.Body.slice(0,7).toUpperCase() === "CREATE ") {
          req.body = {
            'name': req.body.Body.slice(7),
            'username': req.user.username
          };
          groupController.create(req, res);
        } else if (req.body.Body.slice(0,6).toUpperCase() === "LEAVE ") {
          groupController.find(req.body.Body.slice(6), function (group) {
            req.group = group;
            req.body.username = user.username;
            groupController.leave(req, res);
          });
        } else if (req.body.Body.slice(0,5).toUpperCase() === "SHOW "){
          groupController.find(req.body.Body.slice(5), function (group) {
            req.group = group;
            req.body.username = user.username;
            groupController.show(req, res);
          });
        } else if(req.body.Body.slice(0,7).toUpperCase() === "INVITE "){
          var messageBody = req.body.Body.split(' ');
          var inviteeNumber = messageBody[2];

          groupController.find(messageBody[1], function (group) {
            req.group = group;
            req.body.username = user.username;
            req.body.inviteeNumber = inviteeNumber;
            groupController.invite(req, res);
          });
        // } else if (req.body.Body === "BROWSE"){
        //   groupController.browse(req, res);

        // } else if (req.body.body.slice(0,7).toUpperCase() === "SIGNUP ") {
        //   TODO: prompt user info via sms
        //   userController.signup(req, res);

        } else {
          groupController.find(req.body.Body.toLowerCase(), function (group) {
            req.group = group;
            groupController.ping(req, res);
          });
        }
        // if user is not registered/does not exist
      } else {
        if (req.body.Body.slice(0,7).toUpperCase() === "SIGNUP ") {
          var messageBody = req.body.Body.split(' ');
          var newPhoneNum = req.body.From.slice(2);
          var newUsername = messageBody[1];
          var newEmail = messageBody[2];
          var errorHandler = function(err){
            if(err) {
              throw err;
            }
          }

          req.body.username = newUsername;
          req.body.email = newEmail;
          req.body.phone = newPhoneNum;

          console.log('this is a string', req.body);
          userController.signup(req,res,errorHandler);

        } else {
          var newPhoneNum = req.body.From.slice(2);
          var signupMessage = 'To join GuacFriends, please respond to this message with "signup <username> <email>"';
          clients.sendSMS(signupMessage,newPhoneNum);
          res.end('Thanks for signing up!');
        }
      }
    });

  });

  app.post('/sendgrid', function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      var start = fields.from[0].indexOf('<');
      var end = fields.from[0].indexOf('>');
      userController.findByEmail(fields.from[0].slice(start + 1, end), function (user) {
        req.user = user;

        if (fields.subject[0].slice(0,5).toUpperCase() === "JOIN ") {
          groupController.find(fields.subject[0].slice(5), function (group) {
            req.group = group;
            req.body.username = user.username;
            groupController.join(req, res);
          });

        } else if (fields.subject[0].slice(0,7).toUpperCase() === "CREATE ") {
          req.body = {
            'name': fields.subject[0].slice(7),
            'username': req.user.username
          };
          groupController.create(req, res);

        // } else if (fields.subject[0].slice(0,7).toUpperCase() === "BROWSE"){
        //   groupController.browse(req, res);

        } else {
          groupController.find(fields.subject[0].toLowerCase(), function (group) {
            req.group = group;
            groupController.ping(req, res);
          });
        }
      })
    });
  });
};
