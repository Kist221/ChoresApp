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
// UID IS FOR TASK REFERENCE (CHANGE TO DISPLAY NAME LATER)
var uid = null;
var user;

// LOGIN AUTH CODE
// click event for LOGIN
$("#loginForm").on("click", "#btnLogin", function(){
  event.preventDefault();
  // Sign in anonymously function
  // firebase.auth().signInAnonymously();
  // run SIGN IN function
  handleSignIn();
});
// click event for SIGN UP
$("#loginForm").on("click", "#btnSignup", function(){
  event.preventDefault();
  // run SIGN UP function
  handleSignUp();
});
// click event for LOGOUT
$("#btnLogout").on("click", function(){
  // logout user
  firebase.auth().signOut();
  uid = null;
  $("#currentUser").empty();
});

// calls function when user value is changed
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    user = firebase.auth().currentUser;
    console.log(user);
    var name = user.displayName;
    // If user has no Username
    if (name === null) {
      // show username modal
      $("#usernameModal").modal('show');
      // get value of username input on submit button click
      $("#usernameModal").on("click", "#btnUsername", function() {
        // ALWAYS PREVENT DEFAULT
        event.preventDefault();
        // get value
        uid = $("#usernameInput").val();
        console.log(uid);
        // push username to user profile
        updateUsername(uid);
        // hide modal
        $("#usernameModal").modal('hide');
        // display current username on page
        $("#currentUser").text(uid);
      });
    } else {
      $("#currentUser").text(name);
      // store display name for task reference
      uid = name;
      console.log(uid);
    }
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

// Function to update username
function updateUsername(input) {
  var user = firebase.auth().currentUser;
  // update username
  user.updateProfile({
    displayName: input
  }).then(function() {
    // Update successful.
    console.log("Username Updated");
  }).catch(function(error) {
    // An error happened.
    console.log(error);
  });
};

// Function to display errors in modal
function errorMessage(error) {
  // push error message to error modal
  $("#errorMessage").text(error);
  // display modal
  $("#errorModal").modal('show');
};

// Close Modal on clicking X
$(".modal").on("click", ".close", function() {
  $(".modal").modal('hide');
})

// Function to SIGN IN
function handleSignIn() {
  if (firebase.auth().currentUser) {
    // signout
    firebase.auth().signOut();
  } else {
    var email = document.getElementById('emailInput').value;
    var password = document.getElementById('passInput').value;
    if (email.length < 4) {
      errorMessage('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      errorMessage('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorText = error.message;
      if (errorCode === 'auth/wrong-password') {
        errorMessage('Wrong Password');
      } else {
        errorMessage(errorText);
      }
      console.log(error);
    });
  }
};

// Function to SIGN UP
function handleSignUp() {
  var email = document.getElementById('emailInput').value;
  var password = document.getElementById('passInput').value;
  if (email.length < 4) {
    errorMessage('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    errorMessage('Please enter a password.');
    return;
  }
  // Sign Up and Login with email and pass.
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorText = error.message;
    // check if error is weak password
    if (errorCode == 'auth/weak-password') {
      errorMessage('The password is too weak.');
    } else {
      errorMessage(errorText);
    }
    console.log(error);
  });
};




// DATABASE MANIPULATION FOR FIREBASE
// Create an initial timeNow variable
var timeNow = Date.now();
// ADD chores to Database
//  On Click event associated with the add-chore function
$("#add-chore").on("click", function(event) {
  // prevent form submission
  event.preventDefault();
  // prevent empty input
  if ($("#chore").val().trim() !== "") {
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
      choreID: timeNow,
      completed: false
    }
    // clear input 
    $("#chore").val("");
    // push data to database
    db.ref('/chores/' + timeNow).set(chore);
  // Display error if user input blank
  } else if ($("#chore").val().trim() === "") {
    errorMessage('Please Input A Task');
  }
});


// database reference for the chores child object
var rootChoresRef = firebase.database().ref().child("chores");

//Display CHORES on page
// when a child is added or page refreshed grab new snapshot
rootChoresRef.on("child_added" , snap => {
  // grab objects key values and store in variables 
  var text = snap.child("text").val();
  var creatorUid = snap.child("creatorUid").val();
  var time = snap.child("time").val();
  var choreID = snap.child("choreID").val();
  var owner = snap.child("owner").val();
  var completed = snap.child("completed").val();
  // create chore HTML object with variable data
  var toDoChore = $("<p>").attr("id", "item-" + choreID).append("<strong> " + text + "</strong><br />Created By: " + creatorUid + " on " + time);
  // create task close checkbox
  var choreClose = $("<button>").attr("removeUid", choreID).addClass("checkbox").append("&check;");
  // Append the close checkbox to the HTML object
  toDoChore = toDoChore.prepend(choreClose);
  // Check if owner and display accordingly
  if (owner === "") {
    console.log("no owner");
    // Prepend the HTML to page (so it displays on top)
    $("#chore-list").prepend(toDoChore);
  } else if (owner !== "" && completed === false) {
    console.log("owner= " + owner + " but not completed");
    // create owner display
    var displayOwner = $("<h6>").text("Owner: " + owner);
    toDoChore = toDoChore.prepend(displayOwner);
    // add to owned chore list
    $("#owned-list").prepend(toDoChore);
  } else if (owner !== "" && completed === true) {
    console.log("task completed");
    // add to completed chore list
    $("#completed-list").prepend(toDoChore);
  }
});

// Move chores once claimed originally
rootChoresRef.on("child_changed" , snap => {
  var choreID = snap.child("choreID").val();
  var owner = snap.child("owner").val();
  var completed = snap.child("completed").val();
  // check if owner is set
  if (owner === "") {
    console.log("no owner");
  } else if (owner !== "" && completed === false) {
    console.log("owner= " + owner + " and not completed");
    // store task html in var
    var taskHTML = $("#item-" + choreID);
    // create owner display
    var displayOwner = $("<h6>").text("Owner: " + owner);
    taskHTML = taskHTML.prepend(displayOwner);
    // move task html to owned div
    $("#owned-list").prepend(taskHTML);
  } else if (owner !== "" && completed === true) {
    console.log("completed");
    // store task html in var
    var taskHTML = $("#item-" + choreID);
    // move task html to completed div
    $("#completed-list").prepend(taskHTML);
  }
});

// Remove CHORES from page
// watch for chores being removed to remove them from the page live
rootChoresRef.on("child_removed" , snap => {
  // grab objects key values and store in variables 
  var choreID = snap.child("choreID").val();
  // Locate and remove
  $("#item-" + choreID).remove();
});

// Move CHORES to owned div  #1
// Click event for unowned tasks
$("#chore-list").on("click", ".checkbox", function() {
  // Get the number of the button from its data attribute and hold in a variable called removeUid.
  var removeUid = $(this).attr("removeUid");
  db.ref("/chores/" + removeUid + "/owner").set(uid);
});

// Move CHORES to completed div  #2
// Click event for owned tasks
$("#owned-list").on("click", ".checkbox", function() {
  // Get the number of the button from its data attribute and hold in a variable called removeUid.
  var removeUid = $(this).attr("removeUid");
  db.ref("/chores/" + removeUid + "/completed").set(true);
});

// Delete CHORES in completed div from database  #3
// Click event for completed tasks
$("#completed-list").on("click", ".checkbox", function() {
  // Get the number of the button from its data attribute and hold in a variable called removeUid.
  var removeUid = $(this).attr("removeUid");
  db.ref("/chores/" + removeUid).remove();
});


// UNCOMMENT ME FOR FINAL PROJECT

// WEATHER API Implement

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




