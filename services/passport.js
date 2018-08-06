const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const jwt = require('jwt-simple');

//Import config keys
const config = require('./../config');
//Fetching models from firebase service
const userRef = require('./firebase').userRef;

passport.use(new GoogleStrategy({
    clientID: config.google_oauth_client_id,
    clientSecret: config.google_oauth_client_secret,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    console.log("Logging In....");

    var data = profile._json;

    const user = {
      google_id: data.id,
      displayName: data.displayName,
      avatar_url: data.image.url,
      last_login: new Date(Date.now()),
      isLogin: true,
    };

    //Merge the old user data with the new user data if user already exist in our database
    userRef.doc(user.google_id).set(user, {merge: true}).then(function() {
      return done(null, user);
    }).catch(function(err) {
      console.error("Error adding document: ", error);
      return(null, false);
    });
  }
));

passport.serializeUser(function(user, done) {

  //Serialize the user with user's id
  done(null, user.google_id);
});

passport.deserializeUser(function(id, done) {

  console.log(id);
  //Deserialize the user by retrieving the user from database using the user's id
  userRef.doc(id).get().then(function(doc) {
    if(doc.exists) {
      var user = doc.data();

      done(null, user);
    } else {
      console.log("Error deserializing user during login because user is not found in database");
      done(null, false);
    }
  }).catch(function(error) {
    console.log("Error deserializing user during login: " + error);
    done(null, false);
  });
});
