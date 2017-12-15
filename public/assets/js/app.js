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
    var uid = user.uid;
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
// reference firebase database
var db = firebase.database();

// watch database and console log changes
db.ref().on("value", function(snap) {
  console.log(snap.val());
});



// Create an initial choreCount variable
var choreCount = 0;

// // function to get chore value and clear input box
// var getChoreVal = function() {
//   // Get the to-do "value" from the textbox and store it a variable
//   var choreVal = $("#chore").val().trim();
//   // Clear the textbox when done
//   $("#chore").val("");
//   // return value
//   return choreVal;
// };


// creates chore from submit value
var createChore = function(chore) {
  // create chore p item with data
  var toDoChore = $("<p>").attr("id", "item-" + choreCount).append(" " + chore.text);
  // create task close checkbox
  var choreClose = $("<button>").attr("data-chore", choreCount).addClass("checkbox").append("&check;");
  // Append the button to the to do item
  toDoChore = toDoChore.prepend(choreClose);
  // Add the button and chore item to the chore-list div
  $("#chore-list").append(toDoChore);
  // Add to the toDoCount
  choreCount++;
  // return chore
  return toDoChore;
};



//  On Click event associated with the add-chore function
$("#add-chore").on("click", function(event) {
  // prevent form submission
  event.preventDefault();
  var choreVal = $("#chore").val().trim();
  const choreId = Date.now()
  const chore = {
    text: choreVal,
    id: choreId
  }
  // run function to create new chore inside variable to push to server (testing)
  createChore(chore);
  $("#chore").val("");
  // push data to database
  db.ref('chore-' + choreId).set(chore);
});



// Click event for closeout of tasks
$(document.body).on("click", ".checkbox", function() {
// Get the number of the button from its data attribute and hold in a variable called  choreNumber.
var choreNumber = $(this).attr("data-chore");
// Select and Remove the specific <p> element that previously held the to do item number.
$("#item-" + choreNumber).remove();
});



 // READ DATABASE AND PUBLISH TO PAGE


//var fireText = document.getElementById("fireText");

// var firebaseTextRef = firebase.database().ref().child("text");

// firebaseTextRef.on('value', function(snapshot) {
  // fireText.innerText = snapshot.val();
  // console.log(snapshot.val());
//}); 


 // READ DATABASE AND PUBLISH TO PAGE pt.2

  // USERS


var rootRef = firebase.database().ref().child("users");

rootRef.on("child_added" , snap => {

var email = snap.child("email").val();
var username = snap.child("username").val();

$("#user-body").append("<div><p>" + email + "</p><p>" + username + "</p></div>");

});


 //CHORES

var rootChoresRef = firebase.database().ref().child("chores");

rootChoresRef.on("child_added" , snap => {

var text = snap.child("text").val();
var time = snap.child("time").val();

$("#chores-body").prepend("<div><p>" + text + "</p><p>" + time + "</p></div>");
});











