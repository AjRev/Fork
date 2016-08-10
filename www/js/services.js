var forkapp = angular.module('fork.services', [])
var myDb = new Firebase('https://glowing-torch-9862.firebaseio.com/');
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
	var bill = value;
	var id = key;
	bill.pushid = id
	tempbill.push(bill);
	});
	console.log(tempbill);
	deferred.resolve(tempbill);
	});
	return deferred.promise;
	}

	
	
		} //factory brace
		}]) // Main brace

forkapp.factory('UserData', ["$rootScope", "$firebaseArray", "$firebaseObject", "$q", function ($rootScope, $firebaseArray, $firebaseObject, $q) {
var users = {};
users.count = 0;
users.names = [];

var event = {};
var totalbill = [];

var ref = myDb.child("Users");
return {
	ref: function () {
                    return ref;
                },
	
	getEventid: function() {
				var ref = new Firebase("https://glowing-torch-9862.firebaseio.com/Users");
				var getusers = $firebaseArray(ref);
				return getusers;
				
						},
	randomHouseCode: function () {
                    return Math.floor((Math.random() * 100000000) + 100);
                },
	
	eventDescription: function(currUser) {
	var deferred = $q.defer();
	var eventref = new Firebase("https://glowing-torch-9862.firebaseio.com/Events");
	eventref.on('value', function(snapshot){
	var data = snapshot.val();
	console.log(data);
	})
	
	//var usersRef = ref.child(escapeEmailAddress(currUser));
	//usersRef.on('value', function(snapshot) {
	//var data = snapshot.val();
	//var eventid = data.eventid;
	//eventref.orderByChild("Eventid").startAt(eventid).endAt(eventid).on("child_added", function(snapshot) {
		//	    var eventtemp = snapshot.val();
			//	event = eventtemp;
				//});
				//});
				}, //eventDescription brace
	
	getDesc: function () {
	return event.Description;
	},
	
	getBuddies: function () {
	return event.Users;
	},
	
	getEventid: function () {
	return event.Eventid;
	},
	
	postBill: function(Eventid) {
	var ref = new Firebase('https://glowing-torch-9862.firebaseio.com/Bill/');
	ref.orderByChild("Eventid").equalTo(Eventid).on("value", function(snapshot) {
	snapshot.forEach(function(data) {
	var bill = data.val();
	totalbill.push(bill);
	});
	});
	},
	
	getBill: function() {
	return totalbill;
	}
	
		} //return statements brace

}])

forkapp.service('UserService', function ($rootScope) {
var UserService = {};
UserService.count = 0;
UserService.names = [];

UserService.sendCount = function (num) {
this.count = num;
alert(UserService.count);
$rootScope.$broadcast('sending_usercount');
};

UserService.getCount = function() {
alert(UserService.count);
return UserService.count;
};

UserService.sendNames = function (value) {
UserService.names.push(value);
}

UserService.getNames = function () {
return UserService.names;
}

return UserService;


//userCount: function (rootScope) {
	//users.count = rootScope.numOfUsers;
	//alert(users.count);
	//return users.count;
	//	},
	}); // Service brace

forkapp.service('EventService', function ($rootScope) {
var EventService = {};
var Eventid = 0;
EventService.getEvent = function(myevents) {
this.EventService = myevents;
return this.EventService;
}


EventService.getDescription = function(Eventid) {
return EventService.Description;
}

return EventService;
});


	
	
	
	
	
	
	