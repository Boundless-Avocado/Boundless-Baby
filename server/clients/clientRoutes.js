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
          var messageBody = req.body.Body.split(' ');
          groupController.find(messageBody[1], function (group) {
            if (group.key) {
              if (messageBody[2] === group.key) {
                req.group = group;
                req.body.username = user.username;
                groupController.joinPing(req, res);
                groupController.join(req, res);
              } else {
                var callerNumber = req.body.From.slice(2);
                clients.sendSMS('This group is private! Please respond with "join ' + group.name + ' <key>"', callerNumber);
                res.end('Joining group failed');
              }
            } else {
              req.group = group;
              req.body.username = user.username;
              groupController.joinPing(req, res);
              groupController.join(req, res);
            }
          });

        } else if (req.body.Body.slice(0,7).toUpperCase() === "CREATE ") {
          var messageBody = req.body.Body.split(' ');
          if (messageBody[2]) {
            req.body = {
              'name': messageBody[1],
              'username': req.user.username,
              'key': messageBody[2].toString()
            };
          } else {
            req.body = {
              'name': messageBody[1],
              'username': req.user.username,
              'key': null
            };
          }
          groupController.create(req, res);

        } else if (req.body.Body.slice(0,6).toUpperCase() === "LEAVE ") {
          groupController.find(req.body.Body.slice(6), function (group) {
            req.group = group;
            req.body.username = user.username;
            groupController.leave(req, res);
          });
        } else if (req.body.Body.slice(0,5).toUpperCase() === "SHOW "){
          groupController.find(req.body.Body.slice(5), function (group) {
            if (group.key) {
              user.getGroups().then(function(groups) {
                var found = false;
                console.log("THIS IS A GROUPS VARIABLE: ", groups);
                for (var i = 0; i < groups.length; i++) {
                  if (group.name === groups[i].dataValues.name) {
                    found = true;
                  }
                }
                if (found) {
                  req.group = group;
                  req.body.username = user.username;
                  groupController.show(req, res);
                } else {
                  var callerNumber = req.body.From.slice(2);
                  clients.sendSMS("This group is private! You need to be in the group to see list of members", callerNumber);
                }
              });
            } else {
              req.group = group;
              req.body.username = user.username;
              groupController.show(req, res);
            }
          });
        } else if(req.body.Body.slice(0,7).toUpperCase() === "INVITE "){
          var messageBody = req.body.Body.split(' ');
          var inviteeNumber = messageBody[2];

          groupController.find(messageBody[1], function (group) {
            req.group = group;
            req.body.username = user.username;
            req.body.inviteeNumber = inviteeNumber;
            req.body.key = group.key;
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
