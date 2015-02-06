// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('Avocado', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  //setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.login', {
    url: '/login',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-login.html'
        //controller: '???????'
      }
    }
  })

  .state('tab.create-group', {
      url: '/create',
      views: {
        'tab-create-group': {
          templateUrl: 'templates/tab-create-group.html',
          //controller: '???????'
        }
      }
    })

    .state('tab.groups', {
      url: '/groups',
      views: {
        'tab-groups': {
          templateUrl: 'templates/tab-groups.html',
          //controller: '????????'
        }
      }
    })

  .state('tab.my-group', {
      url: '/mygroups',
      views: {
        'tab-my-groups': {
          templateUrl: 'templates/tab-my-groups.html',
          //controller: '??????'
        }
      }
    })

   .state('signup', {
      url: '/signup',
      templateUrl: 'templates/tab-signup.html',
      //controller: '??????'
    })


   .state('signin', {
      url: '/signin',
      templateUrl: 'templates/tab-signin.html',
      //controller: '??????'
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/login');

});
