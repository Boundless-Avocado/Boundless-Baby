var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    helpers     = require('./helpers.js'); // our custom middleware
var multiparty = require('multiparty');

module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var userRouter = express.Router();
  var groupRouter = express.Router();
  var clientRouter = express.Router();
  var facebookRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({type: 'application/*+json'}));
  app.use(express.static(__dirname + '/../client'));


  app.use('/api/users', userRouter); // use user router for all user request
  app.use('/api/groups', groupRouter); // use group router for group request
  app.use('/api/clients', clientRouter); // use client router for all client request
  app.use('/auth/facebook', facebookRouter); // use facebook router for facebook authorization


  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('./users/userRoutes.js')(userRouter);
  require('./groups/groupRoutes.js')(groupRouter);
  require('./clients/clientRoutes.js')(clientRouter);
  require('/facebook/facebookRoutes.js')(facebookRouter);
};
