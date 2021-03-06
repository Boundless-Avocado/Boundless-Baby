angular.module('boundless.groups', ['boundless.services'])

.controller('GroupsController', function($scope, $window, $location, Groups) {
	//hold data here after quering db
	$scope.data = {
		groups: Groups.data,
		users: [],
		usergroups : []
	};

	$scope.joinGroup = function() {
		var username = $window.localStorage.getItem('username');
		var name =groupName.name;
		var data = {
			username: username, 
			name: name
		};
		console.log(data.username +' joined the group: ' + data.name);

		Groups.joinGroup(data)
			.then(function() {
				$location.path('/groups');
			})
			.catch(function(error) {
				console.log(error);
			});
	};

	 
	$scope.getGroups = function(groupName) {
		console.log('group.js: ' + groupName);
		Groups.getGroups(groupName)
			//server sends back groups which should be an array containing objects
			.then(function (data) {
				$scope.data.groups = data;
		})
	};

	$scope.createGroup = function() {
		console.log($scope.group.name)
		//pass groupName & username to create a new group
		var name = $scope.group.name;
		var username = $window.localStorage.getItem('username');
		var data = {
			username: username, 
			name: name
		};

		Groups.createGroup(data)
			.then(function() {
				$location.path('/groups');
			})
			.catch(function(error) {
				console.log(error);
			});
	};

	$scope.pingGroup = function(groupName) {
		//only the username is need to ping the group
		var name = groupName.name;
		var username = $window.localStorage.getItem('username');
		console.log('pingGroup: ' + username)
		var data = {
			username: username,
			name: name
		};

		Groups.pingGroup(data)
			.then(function() {
				$location.path('/groups');
			})
			.catch(function(error) {
				console.log(error);
			});
	};

	//fetches all the members in the group
	$scope.getUsers = function(groupName) {
		console.log('first step: ' + groupName);
		Groups.getUsers(groupName)
			.then(function(data) {
				console.log('getUsers data: ' + data);
				$scope.data.users = data;
			})
	};

	//fetches all the groups a user is a member of
	$scope.userGroups = function() {
		console.log('groups.js');
		var username = $window.localStorage.getItem('username');
		var data = {
			username: username
		};

		Groups.userGroups(data)
			.then(function(data) {
				console.log(data);
				$scope.data.usergroups = data;
			})
			.catch(function(error) {
				console.log(error);
			});
	};

	$scope.leaveGroup = function(groupName) {
		//only the username is need to ping the group
		var name = groupName.name;
		var username = $window.localStorage.getItem('username');
		console.log(username + ' is leaving group: ' + name)
		var data = {
			username: username,
			name: name
		};

		Groups.leaveGroup(data)
			.then(function() {
				$location.path('/groups');
			})
			.catch(function(error) {
				console.log(error);
			});
	};

	$scope.inviteToGroup = function(groupName) {
		var username = $window.localStorage.getItem('username');
		var name = $scope.inviteGroup.name
		var friendName = $scope.friend.name
		var number = $scope.friend.number
		console.log(username + ' invited their friend to: ' + name, number)
		var data = {
			username: username,
			groupName: name,
			friendName: name,
			number: number
		};

		Groups.inviteToGroup(data)
			.then(function() {
				$location.path('/groups');
			})
			.catch(function(error) {
				console.log(error);
			});
	};

	$scope.getGroups();
	$scope.userGroups();
});	
