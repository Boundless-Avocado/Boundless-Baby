angular.module('boundless.group-template', ['ionic'])


.controller('GroupTemplateController', function($scope, $timeout, $ionicModal, $ionicSideMenuDelegate) {

  $scope.groups = [];

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-group.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Called when the form is submitted
  $scope.createGroup = function(group) {
    $scope.groups.push({
      title: task.title
    });
    $scope.taskModal.hide();
    task.title = "";
  };

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

});