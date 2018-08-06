const jwt = require('jwt-simple');
const config = require('./../config');
const userRef = require('../services/firebase').userRef;

exports.login = function(req, res, next) {
  var token = req.cookies['authorization'];
  if(token) {
    res.redirect(config.client.url);
  } else {
    res.redirect('/auth/google');
  }
}
exports.googleAuthCallback = function(req, res, next) {

  console.log("Login Success");

  var timestamp = new Date().getTime();
  var payload = {
    sub: req.user.google_id,
    iat: timestamp
  };

  var token = jwt.encode(payload, config.secret);

  res.cookie('authorization', token, {expires : new Date(Date.now() + 1000*60*60*24*30)});

  console.log(config.client.url);
  //redirect back to client app
  res.redirect(config.client.url);
  // res.send('Redirecting to client app');
}

exports.getUser = function(req, res, next) {
  // var authenticated = res.get('authorization');
  var token = req.cookies['authorization'];
  // console.log(token);

  //Decode the jwt token using method from jwt-simple module
  var payload = jwt.decode(token, config.secret);

  var user_id = payload.sub;

  var auth = {
    success: '',
    error: '',
    user: {
      displayName: '',
      avatar_url: ''
    }
  };

  console.log("Verifying user is log in");

  userRef.doc(user_id).get().then(function(doc) {
    //Retrieving user profile to be set on client app
    if(doc.exists)  {
      //Retrieving the data from the Firebase SnapShot object
      user = doc.data();

      auth.user = user;
      //Conditional field on the client authentication
      auth.success = true;

      console.log(auth.user.displayName + ' is authenticated');
      res.json(auth);
    } else {
      console.log('Authentication failed because user can not be found in the database');
      auth.success = false;
      res.json(auth);
    }
  }).catch(function(error) {
    auth.error = error;
    auth.success = false;
    console.log('Authentication failed with error: ' + error);
    res.json(auth);
  });
};

exports.getUserById = function(req, res, next) {
  var user_id = req.query.user_id;

  var response = {
    success: '',
    user: '',
  }

  userRef.doc(user_id).get().then(function(doc) {
    var user = doc.data();

    response.user = user;
    response.success = true;

    res.json(response);
  }).catch(function(err) {
    console.error('Failed to get user: ' + err);
    response.success = false;
    res.json(response);
  })
};

exports.getUserByToken = function(req, res, next) {
  var token = req.params.token;

  var payload = jwt.decode(token, config.secret);

  var user_id = payload.sub;

  var response = {
    success: '',
    user: {
      displayName: '',
      avatar_url: '',
      token: token
    }
  }
  userRef.doc(user_id).get().then(function(doc) {
    var user = doc.data();

    response.user.displayName = user.displayName;
    response.user.avatar_url = user.avatar_url;
    response.success = true;
    response.user.id = doc.id;

    res.json(response);
  }).catch(function(err) {
    console.error("Failed to get user: " + err);
    response.success = false;
    res.json(response);
  })
};

exports.logout = function(req, res, next) {

  console.log("Logging out....");
  var token = req.cookies['authorization'];

  console.log(token);
  if(token) {
    var payload = jwt.decode(token, config.secret);
    console.log(payload);
    var user_id = payload.sub;
    console.log(user_id);
    userRef.doc(user_id).delete().then(function() {
      //Kill the cookie by setting the expire date to NOW
      res.cookie('authorization', token, {expires : new Date(Date.now())});
      res.send('A user have log out');
    }).catch(function(error) {
      res.send(error);
    });
  } else {
    res.send(false);
  }
  //
  // res.send('user already logout(no token in cookie)');
}
