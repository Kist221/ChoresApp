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

// Sign in anonymously function
firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  console.log(errorCode, errorMessage);
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    // ...
    console.log(isAnonymous, uid);
  } else {
    // User is signed out.
    // ...
  }
  // ...
});

    // Create an initial choreCount variable
    var choreCount = 0;

    //  On Click event associated with the add-chore function
    $("#add-chore").on("click", function(event) {
      event.preventDefault();

    // Get the to-do "value" from the textbox and store it a variable
    var newChore = $("#chore").val().trim();


    // 
    var toDoChore = $("<p>");

      toDoChore.attr("id", "item-" + choreCount);
      toDoChore.append(" " + newChore);


    // 
    var choreClose = $("<button>");

      choreClose.attr("data-chore", choreCount);
      choreClose.addClass("checkbox");
      choreClose.append("&check;");

    // Append the button to the to do item
      toDoChore = toDoChore.prepend(choreClose);

    // Add the button and chore item to the chore-list div
      $("#chore-list").append(toDoChore);

    // Clear the textbox when done
      $("#chore").val("");

    // Add to the toDoCount
      choreCount++;
    });

       $(document.body).on("click", ".checkbox", function() {

      // Get the number of the button from its data attribute and hold in a variable called  choreNumber.
      var choreNumber = $(this).attr("data-chore");

      // Select and Remove the specific <p> element that previously held the to do item number.
      $("#item-" + choreNumber).remove();
    });

