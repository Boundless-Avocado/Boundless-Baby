var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    helpers     = require('./helpers.js'), // our custom middleware
    multiparty = require('multiparty'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    session = require('express-session'),
    cookieParser = require("cookie-parser");

module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var userRouter = express.Router();
  var groupRouter = express.Router();
  var clientRouter = express.Router();
  var facebookController = express.Router();

  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(session({ secret: 'keyboard cat'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/../client'));

  app.use('/api/users', userRouter); // use user router for all user request
  app.use('/api/groups', groupRouter); // use group router for group request
  app.use('/api/clients', clientRouter); // use client router for all client request
  app.use('/auth/facebook', facebookController); // use facebook controller for facebook authorization


  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('./users/userRoutes.js')(userRouter);
  require('./groups/groupRoutes.js')(groupRouter);
  require('./clients/clientRoutes.js')(clientRouter);
  require('./facebook/facebookController.js')(facebookController);
};
