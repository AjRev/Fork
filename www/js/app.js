var forkapp = angular.module('fork', ['ionic', 'firebase', 'fork.controllers', 'fork.services', 'ngCordova']);

var ref = new Firebase("https://glowing-torch-9862.firebaseio.com/");

forkapp.run(function ($ionicPlatform, $rootScope, $firebaseAuth, $firebase, $window, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
	var fb = new Firebase("https://glowing-torch-9862.firebaseio.com/");
	var myDb = new Firebase('https://glowing-torch-9862.firebaseio.com/');
	var myDbEvent = myDb.child('Events')
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
	
	$rootScope.userEmail = null;
	$rootScope.baseUrl = 'https://glowing-torch-9862.firebaseio.com/';
	
	var authRef = new Firebase($rootScope.baseUrl);
	$rootScope.auth = $firebaseAuth(authRef);
	
	$rootScope.show = function(text) {
      $rootScope.loading = $ionicLoading.show({
        content: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };
	
	$rootScope.hide = function() {
      $ionicLoading.hide();
    };
	
	$rootScope.notify = function(text) {
      $rootScope.show(text);
      $window.setTimeout(function() {
        $rootScope.hide();
      }, 1999);
    };
	
	$rootScope.logout = function() {
      $rootScope.auth.$logout();
      $rootScope.checkSession();
    };
	
	$rootScope.goBackState = function(){
	$ionicViewSwitcher.nextDirection('back');
	$ionicHistory.goBack(); 
	};
	
	$rootScope.checkSession = function() {
      var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
        if (error) {
          // no action yet.. redirect to default route
          $rootScope.userEmail = null;
          $window.location.href = '#/auth/signin';
        } else if (user) {
          // user authenticated with Firebase
          $rootScope.userEmail = user.email;
          $window.location.href = ('#/event');
        } else {
          // user is logged out
          $rootScope.userEmail = null;
          $window.location.href = '#/auth/signin';
        }
      });
    };
	$rootScope.$apply();
  }); //ionic platform ready
  })

  
forkapp.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
$ionicConfigProvider.tabs.position('bottom');
	$stateProvider
    .state('auth', {
      url: "/auth",
      abstract: true,
      templateUrl: "templates/auth.html"
    })
    .state('auth.signin', {
      url: '/signin',
      views: {
        'auth-signin': {
          templateUrl: 'templates/auth-signin.html',
          controller: 'SignInCtrl'
        }
      }
    })
    .state('auth.signup', {
      url: '/signup',
      views: {
        'auth-signup': {
          templateUrl: 'templates/auth-signup.html',
          controller: 'SignUpCtrl'
		  }
      }
    })
	
	
	$stateProvider
		.state('list', {
		url: '/list',
		templateUrl: 'templates/list.html',
		
		controller: 'ListCtrl'
		})
		
		.state('event', {
		cache: 'false',
		url: '/event',
		templateUrl: 'templates/event.html',
		controller: 'EventCtrl'
		})
		
		.state('participants', {
		url: '/participants',
		templateUrl: 'templates/participants.html',
		controller: 'ParticipantCtrl'
		})
		
		.state('myevents', {
		url: '/myevents',
		cache: 'false',
		templateUrl: 'templates/myevents.html',
		controller: 'myeventsCtrl'
		})
		
		.state('addbill', {
		url: '/addbill',
		templateUrl: 'templates/addbill.html',
		controller: 'addbillCtrl'
		})
		
		.state('summary', {
		url: '/summary',
		templateUrl: 'templates/summary.html',
		controller: 'summaryCtrl'
		})
		
	$urlRouterProvider.otherwise("/auth/signin");
	}]);
		














	