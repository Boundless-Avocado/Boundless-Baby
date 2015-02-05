var groupController = require('./groupController.js');


module.exports = function (app) {
  // app is injected from middlware.js

  app.param('group', groupController.parseGroupUrl);

  app.get('/', groupController.browse);
  app.post('/', groupController.create);

  app.get('/:group', groupController.members);
  app.post('/:group', groupController.join);

  app.get('/:group/pings/', groupController.history);
  app.post('/:group/pings/', groupController.ping);

  app.post('/:group/leave/', groupController.leave);
  app.post('/:group/invite/', groupController.invite);
};
