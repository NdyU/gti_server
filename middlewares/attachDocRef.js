
const firebase_db = require('./../services/firebase');

const communityRef = firebase_db.communityRef;
const getUsersRef = firebase_db.getOnlineUsersForCommunity;
const getPostRef = firebase_db.getPostsRefInCommunity;
const getCommentRef = firebase_db.getCommentsRefInPostInCommunity;

exports.refs = {
  community: {
    default: function(req, res, next) {
      req.docRef = communityRef;
      next();
    },
    user: function(req, res, next) {
      var community_id = req.params.community_id;
      req.docRef = getUsersRef(community_id);
      next();
    },
    post: {
      default: function(req, res, next) {
        var community_id = req.params.community_id;

        community_id = community_id.toLowerCase();
        community_id = community_id.replace(new RegExp(" ", "g"), "");

        console.log(community_id);
        
        req.docRef = getPostRef(community_id);
        next();
      },
      comment: function(req, res, next) {
        var community_id = req.params.community_id;
        var post_id = req.params.post_id;
        req.docRef = getCommentRef(community_id, post_id);
        next();
      }
    },
  }
};
