const passport = require('passport');
const session = require('express-session');
const config = require('./config');
const multer = require('multer');
const auth = require('./controllers/auth');
const api = require('./controllers/api');
 
const attachDocRef = require('./middlewares/attachDocRef');

//Local file upload middleware and setup
var communityStorage = require('./services/multerStorage').community;
var communityUploader = multer({storage: communityStorage});

var postStorage = require('./services/multerStorage').post;
var postUploader = multer({storage: postStorage});

var multiPartFormUploader = multer();

//Use defined stragies
require('./services/passport');

//Passport middleware settings, for authentication
const requireAuth = passport.authenticate('google', {
  failureRedirect: '/',
  session: true});

module.exports = function(app) {

  //Using session
  app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
  }));

  //Additional passport configs
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/', function(req, res, next) {
    res.send('Welcome');
  });

  app.get('/login', auth.login);
  app.get('/logout', auth.logout);

  //Google oauth entry point
  app.get('/auth/google', passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'}));
  //Google oauth callback route
  app.get('/auth/google/callback',
    requireAuth,
    auth.googleAuthCallback
  );

  app.get('/getUserById', auth.getUserById);
  app.get('/getUser', auth.getUser);

  //Middlewares for attaching docRef to req object
  app.use('/api/community', attachDocRef.refs.community.default);
  app.use('/api/community/:community_id/users', attachDocRef.refs.community.user);
  app.use('/api/community/:community_id/posts', attachDocRef.refs.community.post.default);
  app.use('/api/community/:community_id/posts/:post_id/comments', attachDocRef.refs.community.post.comment);

  //COMMUNITY APIs
  app.post('/api/community', communityUploader.single('file'), api.community.CREATE);
  app.get('/api/community/:community_id', api.community.GET);
  app.get('/api/community', api.community.GET_LIST);
  app.delete('/api/community/:community_id', api.community.REMOVE);

  //COMMUNITY/USER APIs
  app.post('/api/community/:community_id/users/:user_id', api.community.user.CREATE);
  // app.get('/api/communities/:community_id/users/:user_id', api.community.user.GET_USER);
  app.get('/api/community/:community_id/users', api.community.user.GET_LIST);
  app.delete('/api/community/:community_id/users/:user_id', api.community.user.REMOVE);

  //COMMUNITY/POST
  app.post('/api/community/:community_id/posts', postUploader.single('file'), api.community.post.CREATE);
  app.get('/api/community/:community_id/posts/:post_id', api.community.post.GET)
  app.get('/api/community/:community_id/posts', api.community.post.GET_LIST);
  app.delete('/api/community/:community_id/posts/:post_id', api.community.post.REMOVE);
  //COMMUNITY/POST/COMMENT
  app.post('/api/community/:community_id/posts/:post_id/comments', multiPartFormUploader.none(), api.community.post.comment.CREATE);
  app.get('/api/community/:community_id/posts/:post_id/comments', api.community.post.comment.GET_LIST);
  app.get('/api/community/:community_id/posts/:post_id/comments/:comment_id', api.community.post.comment.GET);
  app.delete('/api/community/:community_id/posts/:post_id/comments/:comment_id', api.community.post.comment.REMOVE);


  app.get('/api/image/:type/:filename', api.image.GET);

  app.get('/api/tag', function(req, res, next) {
    console.log('some one taged the server');
    res.json({success: true});
  })
}
