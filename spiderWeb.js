//
var spiderWeb = angular.module('spiderWeb',[]);
//
spiderWeb.config(function($routeProvider){
	$routeProvider
		.when('/index',{
			controller:'indexController',
			templateUrl:'views/indexTemplate.html'
		})
		.when('/echo',{
			controller:'echoController',
			templateUrl:'views/echoTemplate.html'
		})
		.when('/register',{
			controller:'registerController',
			templateUrl:'views/registerTemplate.html'
		})
		.when('/login',{
			controller: 'loginController',
			templateUrl: 'views/loginTemplate.html'
		})
		.when('/logout',{
			controller: 'logoutController',
			templateUrl: 'views/logoutTemplate.html'
		})
		.when('/loggedin',{
			controller: 'loggedinController',
			templateUrl: 'views/loggedinTemplate.html'
		})
		.otherwise({redirectTo:'/index'})
});
//
spiderWeb.factory('socket',function($rootScope){
	var socket = io.connect();
	return {
		on: function (eventName,callback) {
			socket.on(eventName,function(){  
				var args = arguments;
				$rootScope.$apply(function(){
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName,data,callback) {
			socket.emit(eventName, data,function(){
				var args = arguments;
				$rootScope.$apply(function(){
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	}
});
//
spiderWeb.animation('gnat-in', function($rootScope) {
		return {
				setup: function(){
						//
				},
				start: function(element,done){
						element.removeClass('gnatIn-active');
						element.removeClass('gnatIn');
						element.addClass('gnatIn');
						console.log('element');
						console.log(element);
				}
		};
});
//
spiderWeb.controller('rootController',function($rootScope,$scope,socket){
		$scope.hitCounter = 0;
    socket.on('echo',function(d){
        console.log(d);
    });
    socket.on('broadcast',function(d){
        console.log(d);
    });
    socket.on('hit:update',function(d){
      	console.log(d);
      	$scope.hitCounter = d.statistics.hits;
      	$scope.showCounter = false;
      	setTimeout(function(){
      			$scope.$apply(function(){ 
      					$scope.showCounter = true;
      			});
				}, 1);
    });
    socket.emit('echo','echo');
    socket.emit('broadcast');
    socket.emit('hit:create');
});
//
spiderWeb.controller('indexController',function($scope,socket){

});
//
spiderWeb.controller('echoController',function($scope,socket){

});
//
spiderWeb.controller('registerController',function($scope,socket){
	$scope.register = function (name,password,passwordcheck,rememberme) {
		socket.emit('register',{user:{name:name,password:password}});
	}
	socket.on('registered',function(d){
		console.log(d);
		window.location = "#/login";
	});
});
//
spiderWeb.controller('loginController',function($scope,socket){
	socket.on('notloggedin',function(d){
		console.log(d);
	});
	socket.on('incorrectlogin',function(d){
		console.log(d);
	});
	socket.on('loggedin',function(d){
		console.log('token:'+d);
		window.localStorage.setItem('token',d);
		window.location = "#/loggedin";
	});
	$scope.signin = (function(socket){
		return function (name,password,rememberme) {
			console.log('socket:login:'+name);
			socket.emit('login',{user:{name:name,password:password,rememberme:rememberme}})
		}
	}(socket));
});
//
spiderWeb.controller('loggedinController',function($scope,socket){
	$scope._name = "user@use.net";
	$scope.users = [];
	socket.on('user:update:name',function(d){
		console.log(d);
		$scope._name = d.user.name;
	});
	socket.on('users:update',function(d){
		console.log(d);
		$scope.users = d.users;
	});
	socket.emit('user:read:name',window.localStorage.getItem('token'));
	socket.emit('users:read');
});
//
spiderWeb.controller('logoutController',function($scope,socket){

});
//
/*
spiderWeb.controller('registrantsReadController',function($scope,socket){
	$scope.registrants = [];
	socket.on('registrants/update',function(r){
		console.log(r);
		$scope.registrants = r.registrants;
	});
	socket.emit('registrants/read');
});
spiderWeb.controller('registrantsCreateController',function($scope,socket){
	$scope.create = function () {
		socket.emit('registrants/create',{
			registrant: {
				name: $scope.registrant.name,
				password: $scope.registrant.password,
				passwordcheck: $scope.registrant.passwordcheck
			}
		});
	}
});
spiderWeb.controller('loginController',function ($scope) {
	$scope.login = function () {
		s.emit('login',{
			login: {
				name: $scope.login._name,
				password: $scope.login.password
			}
		});
	}
});
spiderWeb.controller('logoutController',function ($scope) {
	$scope.logout = function () {
		s.emit('logout',{
			logout: {
				token: 'hash'
			}
		});
	}
});
*/
/*
var gnat = {
	register: function () {
		window.location = "http://localhost:10000/#/register";
	},
	login: function () {
		window.location = "http://localhost:10000/#/login";
	},
	logout: function () {
		window.location = "http://localhost:10000/#/logout";
	},
	registrants: function () {
		window.location = "http://localhost:10000/#/registrants"
	}
}
*/
/*
var s = io.connect();
s.on('ping',function(d){console.log(d);});
s.on('register',function(d){console.log(d);});
s.on('unregistered',function(d){console.log(d);});
s.on('registrant',function(d){console.log(d);});
s.on('registered',function(d){
	console.log(d);
	gnat.login();
});
s.on('registrants',function(d){
	console.log(d);
	gnat.updateregistrants();
})
s.on('loggedin',function(d){
	console.log(d);
	gnat.registrants();
});
s.on('incorrectlogin',function(d){console.log(d);});
s.on('notloggedin',function(d){console.log(d);});
*/