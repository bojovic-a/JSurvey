# JSurvey
Web app for posting, managing and filling out surveys. App is written in JavaScript using Express.js and it uses MongoDB database for storing data.
-To use this app, you will need to have an empty MongoDB cluster. Add the file to root of the project tree and name it ".env". Inside that file, you should add a following line: DATABASE_URL="<url for connecting to your mongodb cluster>".
## Functionalities

### Login and register system
-To post surveys, user has to be registered and logged in. Registration is simple, since it only requires username and password and optional "about me" section. Passwords are stored as hash values in database. Registration and login forms are configured to do simple validation.
### Creating surveys
-Once the user is logged in, they can access the "Make a survey" page and use the user interface to make their survey. Once they click the save button, data is sent to server, until then, all data about that survey is stored in ther browser's local storage
### Managing profile
-Registered user can change their profile info. To do this they have to be registered
### (Editing surveys)
...
