var forkapp = angular.module('fork.services', [])
var myDb = new Firebase('https://glowing-torch-9862.firebaseio.com/');
var userref = ref.child('Users');
forkapp.factory('Auth', function ($firebaseAuth, $rootScope) {
            return $firebaseAuth(myDb); 
        })

forkapp.factory('CurrUser', ["$q", "$firebaseObject", function ($q, $firebaseObject) {
var currUser;
var setControl = 0
var eventid = 0;
var event = {};
var participants = [];
//var tempbill = [];
var description;
	return {
    currUser : function(id){
		currUser = id;
		return currUser;
		}, // currUser brace
	showUser : function() {
		return currUser;
		}, //showUser brace
	eventParticipants: function(user) {
		participants.push(user);
		return participants;
		},
	geteventParticipants: function() {
	return participants;
		},
		
	updateEventid: function(id) {
	eventid = id;
	return eventid;
	},
	
	getEventid: function() {
	return eventid;
	},
	
	getEventdesc: function(id) {
	var deferred = $q.defer();
	ref.child('Events').orderByChild('Eventid').equalTo(id).on('value', function (snapshot) {
	event = snapshot.val();
	deferred.resolve(event);
	});
	return deferred.promise;
	},
	
	updateBill: function(bill) {
	ref.child('Bill').push(bill);
	},
	
	getBill: function(id) {
	
	var tempbill = [];
	var deferred = $q.defer();
	ref.child('Bill').orderByChild('eventid').equalTo(id).on('value', function (snapshot) {
	 var tmp = snapshot.val();
		angular.forEach(tmp, function(value,key) {
			var billObj = {};
			billObj.bill = value.bill;
			var email = value.email;
			 ref.child('Users').orderByChild('email').equalTo(email).on("value", function (snap) {
			  var firstNameTemp = snap.val();
				angular.forEach(firstNameTemp, function(value,key) {
	             billObj.firstname = value.firstname;
				 billObj.email = value.email;
	                                   });
	                               });
	 var id = key;
	 billObj.pushid = id;
	 tempbill.push(billObj);
	 });
	
	deferred.resolve(tempbill);
	});
	return deferred.promise;
	},
	
	getNameFrmEmail : function (email) {
	 var deferred = $q.defer();
	 userref.orderByChild('email').equalTo(email).on("value", function (snap) {
	   var user = snap.val();
	   deferred.resolve(user);
		});
		return deferred.promise;
	}
	
	
		} //factory brace
		}]) // Main brace




	
	
	
	
	
	
	