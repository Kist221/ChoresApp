# ChoresApp
App for creating to do lists shared between users.


# Login Page  -  Dillon*

  # Two buttons
  login - signup

    login - popup modal  -  Login with facebook/social? API
            username
            password

    signup - popup modal   -  Signup with facebook/social? API
            name
            user          - check if existing - duplicates
            email         - validation
            phone*        - validation
            pass          -  utilize haveIbeenPwnd API
            confirm pass  -  utilize haveIbeenPwnd API

  compare with server side storage         

  after successful login, store current user in LocalStorage
  

# Application Page  - Dragon Rolls

  # main task input field
    submit stores:
      Task with available data
     
  # Tasks DATA for server storage
      Name:
      Status:
      Created By:
      Assigned To:
      Date Created:
      Date Assigned/Claimed:
      Date Completed:

# Containers to display on page
    open tasks
    assigned/owned tasks
    completed tasks
  
  
  
