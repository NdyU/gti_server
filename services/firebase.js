const firebase = require('firebase');
const config = require('./../config');

require('firebase/firestore');


firebase.initializeApp({
  apiKey: config.firebase_api_key,
  authDomain: config.firebase_auth_domain,
  projectId: config.firebase_project_id,
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);

// console.log(storage);
module.exports = {
  communityRef: db.collection('community'),
  userRef: db.collection('users'),
  db: db,

  getOnlineUsersForCommunity: function(community_id) {
    return db.collection('community').doc(community_id).collection('onlineUsers');
  },
  getPostsRefInCommunity: function(community_id) {
    return db.collection('community').doc(community_id).collection('posts');
  },
  getCommentsRefInPostInCommunity: function(community_id, post_id) {
    return db.collection('community').doc(community_id).collection('posts').doc(post_id).collection('comments');
  }
}
