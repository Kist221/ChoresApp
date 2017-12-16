// Javascript for App Page

// Initialize Firebase
var config = {
 apiKey: "AIzaSyCVB25IfiYdoecRxag3WQlxtFkBAzqbcYs",
 authDomain: "choresapp-18a57.firebaseapp.com",
 databaseURL: "https://choresapp-18a57.firebaseio.com",
 projectId: "choresapp-18a57",
 storageBucket: "choresapp-18a57.appspot.com",
 messagingSenderId: "451640314490"
};

firebase.initializeApp(config);

// reference firebase database
var db = firebase.database();
var uid;


// LOGIN AUTH CODE
// add click events for login/logout
$("#btnLogin").on("click", function(){
  // Sign in anonymously function
  firebase.auth().signInAnonymously();
});

// click event for LOGOUT
$("#btnLogout").on("click", function(){
  // logout user
  firebase.auth().signOut();
});

// calls function when user value is changed
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    uid = user.uid;
    console.log(isAnonymous, uid, user);
    // change login button
    $("#btnLogout").attr("class", "");
    $("#btnLogin").attr("class", "hidden");
  } else {
    // User is signed out.
    // change login button
    $("#btnLogout").attr("class", "hidden");
    $("#btnLogin").attr("class", "");
  }
});



// DATABASE MANIPULATION FOR FIREBASE


// Create an initial timeNow variable
var timeNow = Date.now();


//  On Click event associated with the add-chore function
$("#add-chore").on("click", function(event) {
  // prevent form submission
  event.preventDefault();
  // update timestamp
  timeNow = Date.now();
  // store input value
  var choreVal = $("#chore").val().trim();
  // chore object with data keys
  const chore = {
    text: choreVal,
    creatorUid: uid,
    time: moment().format("l"),
    owner: "",
    choreID: timeNow
  }
  // run function to create new chore inside variable to push to server (testing)
  // createChore(chore);
  $("#chore").val("");
  // push data to database
  db.ref('/chores/' + timeNow).set(chore);
});


// Click event for closeout of tasks
$(document.body).on("click", ".checkbox", function() {
  // Get the number of the button from its data attribute and hold in a variable called removeUid.
  var removeUid = $(this).attr("removeUid");
  // Select and Remove the specific <p> element that previously held the to do item number.
  $("#item-" + removeUid).remove();
  // remove chore from database
  db.ref("/chores/" + removeUid).remove();
});


//Display CHORES
// database reference for the chores child object
var rootChoresRef = firebase.database().ref().child("chores");
// when a child is added to chores object grab new snapshot
rootChoresRef.on("child_added" , snap => {
  // grab objects key values and store in variables 
  var text = snap.child("text").val();
  var time = snap.child("time").val();
  var choreID = snap.child("choreID").val();
  // create chore HTML object with variable data
  var toDoChore = $("<p>").attr("id", "item-" + choreID).append(" Task: " + text + "<br />Created: " + time);
  // create task close checkbox
  var choreClose = $("<button>").attr("removeUid", choreID).addClass("checkbox").append("&check;");
  // Append the close checkbox to the HTML object
  toDoChore = toDoChore.prepend(choreClose);
  // Prepend the HTML to page (so it displays on top)
  $("#chores-body").prepend(toDoChore);
});

// watch for chores being removed to remove them from the page live
rootChoresRef.on("child_removed" , snap => {
  // grab objects key values and store in variables 
  var text = snap.child("text").val();
  var time = snap.child("time").val();
  var choreID = snap.child("choreID").val();
  // Locate and remove
  $("#item-" + choreID).remove();
});








//Display USERS
// var rootRef = firebase.database().ref().child("users");
// rootRef.on("child_added" , snap => {
// var email = snap.child("email").val();
// var username = snap.child("username").val();
// $("#user-body").append("<div><p>" + email + "</p><p>" + username + "</p></div>");
// });


// // function creates chore from submit value
// var createChore = function(chore) {
//   // create chore p item with data
//   var toDoChore = $("<p>").attr("id", "item-" + timeNow).append(" " + chore.text);
//   // create task close checkbox
//   var choreClose = $("<button>").attr("data-chore", timeNow).addClass("checkbox").append("&check;");
//   // Append the button to the to do item
//   toDoChore = toDoChore.prepend(choreClose);
//   // Add the button and chore item to the chore-list div
//   $("#chore-list").append(toDoChore);
//   // return chore
//   return toDoChore;
// };

// // array to store chores objects from db
// var choresArray = [];

// // watch database and console log changes
// db.ref("chores").on("value", function(snap) {
//   // variable stores chores object
//   var chores = snap.val();
//   // loop through chores object and push to choresArray
//   for (var each in chores) {
//     console.log(chores[each]);
//     choresArray.push(chores[each]);
//   }
// });
