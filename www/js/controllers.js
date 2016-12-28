var forkapp = angular.module('fork.controllers', ["firebase", "ionic-modal-select"])

	forkapp.controller('SignUpCtrl', ['$scope', '$rootScope', '$firebaseAuth', '$state', 'CurrUser', function ($scope, $rootScope, $firebaseAuth, $state, CurrUser) {
      $scope.user = {
        firstname: "",
		surname: "",
		email: "",
        password: ""
      };
	  $scope.createUser = function (user) {
				$scope.firstname = user.firstname;
                $scope.surname = user.surname;
                $scope.email = user.email;
                $scope.password = user.password;
				
				var firstname = user.firstname;
                var surname = user.surname;
                var email = user.email;
                var password = user.password;
		
		if (!firstname || !surname || !email || !password) {
                    $rootScope.notify("Please enter valid credentials");
                    return false;
                }

		var auth = $firebaseAuth(myDb);
        auth.$createUser({email: $scope.email, password: $scope.password}).then(function (userData) {
                    console.log("User created successfully!" +userData.uid);
					return auth.$authWithPassword({
                        email: $scope.email,
                        password: $scope.password
                    });
                }).then(function (authData) {
				var id = authData.uid
				$scope.temp = {
                        firstname: $scope.firstname,
                        surname: $scope.surname,
                        email: $scope.email
                               }
					
                    //var usersRef = UserData.ref();
					var usersRef = ref.child('Users');
					
					var myUser = usersRef.child(id);
					myUser.update($scope.temp, function( ret ){
                      
					  CurrUser.currUser(id);
                      $rootScope.hide();
                      $state.go('event'); 
                    });  
				
				}).catch(function (error) {
                    if (error.code == 'INVALID_EMAIL') {
                        $rootScope.hide();
                        $rootScope.notify('Error','Invalid Email.');
                    }
                    else if (error.code == 'EMAIL_TAKEN') {
                        $rootScope.hide();
                        alert('Error','Email already taken.');
                    }
                    else {
                        $rootScope.hide();
                        $rootScope.notify('Error','Oops. Something went wrong.');
                    }
                }); 
    
			}; 
        } 
		])
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
forkapp.controller('SignInCtrl', ['$scope', '$rootScope', '$firebaseAuth', 'CurrUser', '$state', '$ionicPopup', function ($scope, $rootScope, $firebaseAuth, CurrUser, $state, $ionicPopup) {
	
	$rootScope.checkSession();
     $scope.user = {
        email: "",
        password: ""
     };
     
     $scope.user = {
        email: "",
        password: ""
     };
	 $scope.validateUser = function () {
	 var ref = new Firebase("https://glowing-torch-9862.firebaseio.com/");
	 
        var email = $scope.user.email;
        var password = $scope.user.password;
        if (!email || !password) {
           $rootScope.notify("Please enter valid credentials");
           return false;
        }
		ref.authWithPassword({
           email: email,
           password: password
        }, function (error, authData) {
		if (error) {
		
			var alertPopup = $ionicPopup.alert({
			 title: 'Login Error',
			 template: 'Login Failed'
			 });
			 alertPopup.then(function(res) {
			 return;
			 });
			
			} else {
			var id = authData.uid
			CurrUser.currUser(id);
			$state.go('event');
			}
		});
     } 
  }
]) 

forkapp.controller('EventCtrl', ['$scope', '$state', '$timeout', '$rootScope', 'CurrUser', '$firebase', '$q', function($scope, $state, $timeout, $rootScope, CurrUser, $firebase, $q) {
	$scope.events = [];
	var currlogin;
	var fbAuth = ref.getAuth();
	var eventref = ref.child('Events');
	
	if (fbAuth) {
	currlogin = fbAuth.uid;
	};
	
 
		
		function getEventDescription() {
		var myEvents = [];
		var deferred = $q.defer();
		    eventref.orderByChild(currlogin).on("value", function(snapshot) {
				snapshot.forEach(function(childSnapshot) {
				var tmp = childSnapshot.val();
				
				if ( tmp[currlogin] == "True" ) {
				myEvents.push(tmp);
				
				deferred.resolve(myEvents);
				} else { 
				deferred.reject("No Events")
				}
				});
			});
		return deferred.promise;
		};
		
		getEventDescription().then(function (resolve) {
		angular.forEach(resolve, function(value) {
		$scope.events.push(value);
		}, function (reject) {
		console.log(reject);
		});
		});
		
	
		$scope.createEvent = function () {
		$state.go('list');
		}
		
		$scope.displayEvent = function(id) {
		CurrUser.updateEventid(id);
		$state.go('myevents', { reload : true });
		
		};
		
	}]);
///////////////////////////////////////////////////////////LIST CONTROLLER//////////////////////////////////////////////////////////////
forkapp.controller('ListCtrl', ['$scope', '$state', '$rootScope', '$ionicHistory', 'CurrUser', '$window', function($scope, $state, $rootScope, $ionicHistory, CurrUser, $window) {
	$scope.hideBackButton = true;
	var eventref = ref.child('Events');
	var userref = ref.child('Users');
	
	$scope.goBack = function() {
	$state.go('event');
	};
	
	function goBack() {
	$state.go('event');
	};
	
	
	function Eventid() {
                    var id = Math.floor((Math.random() * 100000000) + 100);
					return id;
					   };
					   
	
	
	$scope.broadCast = function(list) {
	var participants = CurrUser.geteventParticipants();
	
	function userCount() {
	return participants.length;
	};
	
     $scope.event = {
	 Description : list.description,
	 Venue : list.venue,
	 Date : list.date,
	 Eventid : Eventid(),
	 Count : userCount(),
	 };
	 
	 var postevent = eventref.push($scope.event, function (error) {
	 if (error) {
	 alert("Data not saved. Pls try again");
		} else {
		
			var postid = postevent.key();
			for (var i = 0; i < participants.length; i++) {
			var user = participants[i];
			userref.orderByChild('email').equalTo(user).on('value', function (snapshot) {
			var temp = snapshot.val();
			var id = Object.keys(temp);
			eventref.child(postid).update({[id]: 'True'});
			})
			};
		};
		goBack();
		});
		
	 };
	
	
	$scope.listParticipants = function () {
	$state.go('participants');
	};
	}]);

///////////////////////////////////////////////////////////PARTICIPANT CONTROLLER//////////////////////////////////////////////////////////////
	
forkapp.controller('ParticipantCtrl', ['$scope', '$state', '$ionicHistory', 'CurrUser', function($scope, $state, $ionicHistory, CurrUser) {

	var userref = ref.child('Users'); 
	var participants = [];
	$scope.users = []; // Array to hold all the users
	
	userref.orderByChild('email').on('value', function (snapshot) {
	snapshot.forEach(function(childSnapshot) {
	$scope.users.push(childSnapshot.val());
	});
	});
	
	$scope.checkedOrNot = function (user, checked, index) {
	if (checked) {
            participants.push(user);
			};
			};
	
	$scope.done = function () {		
	for (var i=0; i<participants.length; i++) {
	CurrUser.eventParticipants(participants[i]);
	};
	$state.go('list');
	};
	}]);
	
/////////////////////////////////////////////////////////// EVENT CONTROLLER//////////////////////////////////////////////////////////////	
	
forkapp.controller('myeventsCtrl', ['$scope', '$state', '$window', 'CurrUser', '$q', '$timeout', '$ionicHistory', '$ionicPopup', '$ionicModal', function($scope, $state, $window, CurrUser, $q, $timeout, $ionicHistory, $ionicPopup, $ionicModal)  { 
$scope.isDisabled = false;
$scope.hideBackButton = true;
$scope.userlist = [];
var settled = " ";
var usercount = 0;
var eventref = ref.child('Events');
var userref = ref.child('Users');
var eventid = CurrUser.getEventid();
var userarr = [];

function checkBillSubmission() {
			  return $q(function(resolve) { 
				var eventid = CurrUser.getEventid();
				var control = ref.child("BillControl").child(eventid).once("value", function (snapshot) {
				var control = snapshot.exists();
				resolve(control);
					}); 
				});
			  };
checkBillSubmission().then(function (result) {
			 if (result == true) {
			 $scope.isDisabled = true;
			 }
			 });

function eventusers(id) {
return $q(function(resolve) {
 eventref.orderByChild("Eventid").equalTo(eventid).on("value", function (snap) {
   var promises = [];
   var users = snap.val();
	angular.forEach(users, function(value,key) {
	 var obj = value;
	  for (var prop in obj) {
		if(obj[prop] == "True") {
		promises.push($q(function(resolve) {
			userref.child(prop).on("value", function (snap) {
			var id = snap.val().firstname;
			resolve(id);
			}); 
			}));
		};
	  };
	  $q(function(resolve) {
	  usercount = promises.length;
	  resolve(usercount); 
	  });
	});
	resolve($q.all(promises));
 });
 })
 };
 
 eventusers(eventid).then(function (response) {
    for (var i = 0; i < response.length; i++) {
        $scope.userlist.push(response[i]);
    }
	});

	$ionicModal.fromTemplateUrl('templates/friends.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
	
$scope.showBuddies = function() { 	
	$scope.modal.show();
};


$scope.bills = [];
	function updateBill() {
	var eventid = CurrUser.getEventid();
	var bills = CurrUser.getBill(eventid);
	return bills;
	};
	
updateBill().then(function (bills) {
angular.forEach(bills, function(value,key) {
$scope.bills.push(value);
});
});


var eventref = ref.child('Events');
var eventid = CurrUser.getEventid();
var fbAuth = ref.getAuth();
var uid = fbAuth.uid;
$scope.uevent = " ";

	function updateEvent(desc) {
	$timeout(function(){
        $scope.$apply(function () { 
			 $scope.uevent = desc;
			}) 
		},1000); 
		}; 

CurrUser.getEventdesc(eventid).then(function (result) {
var description = result;

for (var itemID in description) {
	var tmp = description[itemID];
	$scope.desc = tmp.Description;
    $scope.eventid = tmp.Eventid;	
};
updateEvent($scope.desc);
});

$scope.goBack = function() {
$state.go('event');
};


$scope.reject = function(eventid) {
eventref.orderByChild('Eventid').equalTo(eventid).on("value", function (snapshot) {
	var onComplete = function(error) {
	if (error) {
    console.log('Synchronization failed');
	} else {
    alert("You have removed this event");
	}
	};
	var temp = snapshot.val();
	var tempid = Object.keys(temp);
	var id = " ";
	for (var itemID in tempid) {
	id = tempid[itemID];
	eventref.child(id).update({[uid]: 'False'}, onComplete)
	};
});
};

$scope.addBill = function() {
$state.go('addbill');
};


function sortArray(bills,email) {
bills.sort(function (a,b) {
return a.email > b.email;
});
}
var calcarray = [];

 

 function updateDb() {
			
			$timeout(function(){
			eventusers(eventid).then(function (response) {
			});
			 
		 checkBillSubmission().then(function (result) {
			 if (result == true) {
			 var alertPopup = $ionicPopup.alert({
			 title: 'Submission Alert',
			 template: 'Bill is already submitted'
			 });
			 alertPopup.then(function(res) {
			 return;
			 });
			 }
				
			   if (calcarray.length != usercount) {
                   console.log(calcarray);
			     var alertPopup = $ionicPopup.alert({
			     title: 'Error',
			     template: 'Missing bill(s)'
			     });
			       alertPopup.then(function(res) {
			         return;
			       });
			   } else if (result != true)  {
			    var eventid = CurrUser.getEventid();
				$scope.isDisabled = true;
				CurrUser.getEventdesc(eventid).then(function (result) {
				var temp = result;
				for (var itemID in temp) {
					var tmp = temp[itemID];
					var desc = tmp.Description;
					var submit = "(Submitted)";
					var newdesc = desc.concat(submit);
					eventref.orderByChild('Eventid').equalTo(eventid).on("value", function(snap) {
						var obj = snap.val();
						var fbpushkey = Object.keys(obj);
							for (var key in fbpushkey) {
								var pushkey = fbpushkey[key];
									eventref.child(pushkey).update({Description : newdesc});
											};
									});
								}
							});
				
				
				var eventid = CurrUser.getEventid();
					var onComplete = function (error) {
						if (error) {
							alert ("Error in Final Billing");
							} else if (result != true) {
							var billed = {};
							billed[eventid] = "True";
							ref.child('BillControl').set(billed);
							settled = "(Submitted)";
							$scope.desc = $scope.desc.concat(settled);
							updateEvent($scope.desc);
							} else { 
							return;
							};
						}
				ref.child('FinalBill').child(eventid).push(calcarray, onComplete);
				
				} else {
				return;
				};
				});
				
		},2000);
		};

$scope.calculateBill = function () {
		
		
	   var confirmPopup = $ionicPopup.confirm({
       title: 'Final Bill',
       template: 'Submit Bill?'
		});
		confirmPopup.then(function(res) {
		if(res) {
		
		eventref.orderByChild("Eventid").equalTo(eventid).on ("value", function(snapshot) {
		var snap = snapshot.val();
		angular.forEach(snap, function(value,key) {
		count = value.Count;
		});
		});
		
        sortArray($scope.bills,"email");
		var tmparray = [];
		
		angular.forEach($scope.bills, function (value, key) {
		var tmp = value;
		
		var billobj = {};
		  billobj.email = tmp.email;
		  billobj.bill = tmp.bill;
		  tmparray.push(billobj);
		  
		});
		
		for (var i = 0; i < tmparray.length; i--) {
		if (tmparray.length == 1) {
		i = 0;
		var calcobj = {};
		calcobj.email = tmparray[i].email;
		calcobj.bill = tmparray[i].bill;
		calcarray.push(calcobj);
		break;
		};
		
		i = 0;
		 var j = i + 1;
		   if (tmparray[i].email != tmparray[j].email) {
		    var calcobj = {};
			calcobj.email = tmparray[i].email;
			calcobj.bill = tmparray[i].bill;
			calcarray.push(calcobj);
			console.log(calcarray);
			tmparray.shift();
			  
		   } else if (tmparray[i].email == tmparray[j].email) {
		   var calcobj = {};
		   var bill = 0;
		   bill = bill + tmparray[i].bill + tmparray[j].bill;
		   calcobj.email = tmparray[i].email
		   calcobj.bill = bill;
		   tmparray.shift();
		   tmparray.shift();
		   tmparray.unshift(calcobj);
		   console.log(calcarray)
			 };
			 j = 0;
		    };
		
		updateDb();
		} else {
		return;
		};
		});
		};
		
	$scope.summary = function() {
		$state.go('summary');
		};
	
	$scope.edit = function(item) {
	var billref = ref.child('Bill');
	var pushid = item.pushid;
	var onComplete = function(error) {
		if (error) {
			alert("Deleting of data Failed. Re-try");
			} else {
			     $timeout(function(){
				 $scope.$apply(function () {
					$scope.bills.splice($scope.bills.indexOf(item), 1);
					
					});
					},100);
			}
		};
	
	var delref = billref.child(pushid);
	delref.remove(onComplete);
	
	};

}]);
	

forkapp.controller('addbillCtrl', ['$scope', '$state', '$window', 'CurrUser', '$timeout', function($scope, $state, $window, CurrUser, $timeout)  {
	var eventref = ref.child('Events');
	var userref = ref.child('Users');
	$scope.bill = {};
	$scope.buddies = [];
	
	
	function updateBuddies(user) {
	$timeout(function(){
        $scope.$apply(function () { 
			$scope.buddies.push(user);
			})
		},1000);
		};
	
	var eventid = CurrUser.getEventid();
	eventref.orderByChild('Eventid').equalTo(eventid).on("value", function(snapshot) {
	var tmp = snapshot.val();
	
	angular.forEach(tmp, function(value,key) {
	var newtmp = value;
	 angular.forEach(newtmp, function(value,key) {
	 var userarray = [];
	 if (value == "True") {
	 userarray.push(key);
	 
	 angular.forEach(userarray, function(value,key) {
	 userref.child(value).on("value", function (childsnap) {
	 updateBuddies(childsnap.val());
			});
		  });
		 }
	   });
	 });
	});
	
	$scope.pushBill = function () {
	var eventid = CurrUser.getEventid();
	var tmp = {};
	
	angular.forEach($scope.bill, function (value,key) {
	tmp.email = key;
	tmp.bill = value;
	tmp.eventid = eventid;
	});
	CurrUser.updateBill(tmp);
	$state.go('myevents');
	};
	

	}]);
	
forkapp.controller('summaryCtrl', ['$scope', '$state', '$window', '$timeout', 'CurrUser', '$q', function($scope, $state, $window, $timeout, CurrUser, $q)  {
	var finalref = ref.child('FinalBill');
	var eventid = CurrUser.getEventid();
	$scope.uevent = " ";
	var temp = [];
	$scope.farray = [];
	
	function sortArray(bills,bill) {
	bills.sort(function (a,b) {
	return a.bill < b.bill;
	});
	}
	
	function updateEvent(desc) {
		$timeout(function(){
        $scope.$apply(function () { 
			$scope.uevent = desc;
			})
		},1000);
		};
		
	function emailToName(email) {
	var nameObj = CurrUser.getNameFrmEmail(email);
	return nameObj;
	};

	CurrUser.getEventdesc(eventid).then(function (result) {
	var description = result;

	for (var itemID in description) {
		var tmp = description[itemID];
		$scope.desc = tmp.Description;
		$scope.eventid = tmp.Eventid;	
	  };
	updateEvent($scope.desc);
	 });
	 
	
	 
	 finalref.child(eventid).on("value", function (snapshot) {
	 
	 var snap = snapshot.val();
	 angular.forEach(snap, function (value,key) {
	  angular.forEach(value, function(value,key) {
	  temp.push(value);
	  });
	 });
	 sortArray(temp,"bill");
	 
	 var divarray = [];
	 for (var i = 0; i < temp.length; i++) {
	 var divbill = {};
	 temp[i].bill = temp[i].bill/temp.length;
	 
	 divbill.bill = temp[i].bill;
	 divbill.email = temp[i].email;
	 divarray.push(divbill);
	 };
	 sortArray(divarray,"bill");
	 
	
	
	
	 for (var i = 0; i < divarray.length; i++) {
	 
	 for (var j = i + 1; j < divarray.length; j++) {
	 
	 
	  var amount = (divarray[i].bill - divarray[j].bill).toFixed(2);
	  function getBillAmount(amount) {
	  return $q(function(resolve) {
	  resolve(amount);
	  });
	  };
	  
	  var payeeEmail = divarray[j].email;
	  
	  function getPayeeName(payeeEmail) {
	  return $q(function(resolve) {
		CurrUser.getNameFrmEmail(payeeEmail).then(function (result) {
		 var userObj = result;
		 angular.forEach(userObj, function (value,key) {
		 var payee = value.firstname;
		 resolve(payee);
		 });
		});
		});
		};
		
	 
	  var bossEmail = divarray[i].email;
	  function getBossName(bossEmail) {
	  return $q(function(resolve) {
		CurrUser.getNameFrmEmail(bossEmail).then(function (result) {
		var userObj = result;
		 angular.forEach(userObj, function (value,key) {
		 var boss = value.firstname;
		 resolve(boss);
		 });
		 
		});
		});
		};
	 
	 $q.all({amt: getBillAmount(amount), pay: getPayeeName(payeeEmail), boss: getBossName(bossEmail)}).then(function (responses) {
	 var fbill = {};
	 var amt = responses.amt;
	 var pay = responses.pay;
	 var boss = responses.boss;
	 fbill.amount = amt;
	 fbill.payee = pay;
	 fbill.boss = boss;
	 $scope.farray.push(fbill);
	 });
	 
	 }; // for loop
	 }; // for loop
	 
	 });
	
	 
	 }]);
	
	
function escapeEmailAddress(email) {
    var email = email.replace(/\./g, ',');
    return email;
}

	
	
	
	
	
	
	
	
	
	