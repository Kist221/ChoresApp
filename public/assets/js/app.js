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
// reference firebase database
var db = firebase.database();

// Create an initial timeNow variable
var timeNow = Date.now();


// creates chore from submit value
var createChore = function(chore) {
  // create chore p item with data
  var toDoChore = $("<p>").attr("id", "item-" + timeNow).append(" " + chore.text);
  // create task close checkbox
  var choreClose = $("<button>").attr("data-chore", timeNow).addClass("checkbox").append("&check;");
  // Append the button to the to do item
  toDoChore = toDoChore.prepend(choreClose);
  // Add the button and chore item to the chore-list div
  $("#chore-list").append(toDoChore);
  // return chore
  return toDoChore;
};


var choresArray = [];

// watch database and console log changes
db.ref("chores").on("value", function(snap) {
  // variable stores chores object
  var chores = snap.val();
  // loop through chores object and push 
  for (var each in chores) {
    console.log(chores[each]);
  }
});


// var myUid = firebase.auth().currentUser.uid;


//  On Click event associated with the add-chore function
$("#add-chore").on("click", function(event) {
  // prevent form submission
  event.preventDefault();
  // update timestamp
  timeNow = Date.now();
  // store input value
  var choreVal = $("#chore").val().trim();
  // chore object
  const chore = {
    text: choreVal,
    uid: uid,
    time: moment().format("l"),
    owner: ""
  }
  // run function to create new chore inside variable to push to server (testing)
  createChore(chore);
  $("#chore").val("");
  // push data to database
  db.ref('/chores/' + timeNow).set(chore);
});






// Click event for closeout of tasks
$(document.body).on("click", ".checkbox", function() {
// Get the number of the button from its data attribute and hold in a variable called  choreNumber.
var choreNumber = $(this).attr("data-chore");
// Select and Remove the specific <p> element that previously held the to do item number.
$("#item-" + choreNumber).remove();
});






