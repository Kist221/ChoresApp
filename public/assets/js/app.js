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
var uid = null;

// LOGIN AUTH CODE
// add click events for login/logout
$("#btnLogin").on("click", function(){
  // Sign in anonymously function
  firebase.auth().signInAnonymously();
  $("#myApplication").removeClass("hidden");
});

// click event for LOGOUT
$("#btnLogout").on("click", function(){
  // logout user
  firebase.auth().signOut();
  uid = null;
  $("#myApplication").addClass("hidden");
});

// calls function when user value is changed
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    uid = user.uid;
    console.log(isAnonymous, uid, user);
    // change login display
    $("#btnLogout, #myApplication").removeClass("hidden");
    $("#btnLogin, #loginDiv").addClass("hidden");
  } else {
    // User is signed out.
    // change login display
    $("#btnLogout, #myApplication").addClass("hidden");
    $("#btnLogin, #loginDiv").removeClass("hidden");
  }
});


// DATABASE MANIPULATION FOR FIREBASE


// Create an initial timeNow variable
var timeNow = Date.now();

// ADD chores to Database
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


//Display CHORES on page
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
  $("#chore-list").prepend(toDoChore);
});

// Remove CHORES from page
// watch for chores being removed to remove them from the page live
rootChoresRef.on("child_removed" , snap => {
  // grab objects key values and store in variables 
  var choreID = snap.child("choreID").val();
  // Locate and remove
  $("#item-" + choreID).remove();
});


// Remove CHORES from database
// Click event for closeout of tasks
$(document.body).on("click", ".checkbox", function() {
  // Get the number of the button from its data attribute and hold in a variable called removeUid.
  var removeUid = $(this).attr("removeUid");
  // // Select and Remove the specific <p> element that previously held the to do item number.
  // $("#item-" + removeUid).remove();
  // remove chore from database
  db.ref("/chores/" + removeUid).remove();
});




// // WEATHER API Implement

// // This is our API key
// var APIKey = "203a2fb913c904a5243dbe3fc02745b6";
// // Variables for Geo Coord
// var lat;
// var lon;
// // get Coordinates for Weather
// navigator.geolocation.getCurrentPosition(function(position) {
//   console.log(position);
//   lat = position.coords.latitude;
//   lon = position.coords.longitude;
//   // URL we need to query the database
//   var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;

//   // Here we run our AJAX call to the OpenWeatherMap API
//   $.ajax({
//       url: queryURL,
//       method: "GET"
//     })
//     // We store all of the retrieved data inside of an object called "response"
//     .done(function(response) {
//       // Log the queryURL
//       console.log(queryURL);
//       // Log the resulting object
//       console.log(response);
//       // Transfer content to HTML
//       $(".city").html("<h4>Weather in " + response.name + ":</h4>");
//       $(".wind").text("Wind Speed: " + response.wind.speed);
//       $(".humidity").text("Humidity: " + response.main.humidity);
//       $(".temp").text("Temperature (F) " + response.main.temp);
//     });
// });








//Display USERS
// var rootRef = firebase.database().ref().child("users");
// rootRef.on("child_added" , snap => {
// var email = snap.child("email").val();
// var username = snap.child("username").val();
// $("#user-body").append("<div><p>" + email + "</p><p>" + username + "</p></div>");
// });

