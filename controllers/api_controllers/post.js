const jwt = require('jwt-simple');
const config = require('./../../config');
const multer = require('multer');

const firebase = require('./../../services/firebase');
const s3 = require('./../../services/aws-s3/methods');

//Fetching models from firebase service
// const postRef = firebase.postRef;
const postCommentsRef = firebase.postCommentsRef;
const getPostRef = firebase.getPostsRefInCommunity;

exports.create_post = function(req, res, next) {

  var folderRef = `community/images/${req.file.filename}`;

  s3.upload(req.file, folderRef, function(err, data) {

    //values from header or Post parameter
    var user_id = req.body.user_id;
    var community_id = req.body.community_id;
    var title = req.body.title;
    var external_link = req.body.external_url;
    var image_name = data.Location;
    var date = new Date(Date.now());
    var view_count = 0;

    var post = {
      user_id: user_id,
      title: title,
      external_link: external_link,
      imageName: image_name,
      created: date,
      folderRef: folderRef,
      view_count: 0
    }

    req.docRef.add(post).then(function(docRef) {
      res.json({success: true});
    }).catch(function(err) {
      console.error("Error adding post: ", err);
      res.json({success: false});
    });
  });
}

exports.get_posts = function(req, res, next) {

  var community_id = req.params.community_id;

  var response = {
    success: '',
    list: {}
  }

  req.docRef.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      response.list[doc.id] = doc.data();
    });
    response.success = true;
    console.log(response);
    res.json(response);
  }).catch(function(err) {
    console.error('Failed to query posts: ' + err);
    response.success = false;
    res.json(response)
  });
}

exports.get_post = function(req, res, next) {

  var response = {
    success: '',
    post: ''
  }

  var post_id = req.params.post_id;
  var community_id = req.params.community_id;

  req.docRef
    .doc(post_id)
    .get()
    .then(function(doc) {
      response.post = doc.data();
      response.success = true;
      res.json(response);
    }).catch(function(err) {
      console.error('Failed to query post: ' + err);
      response.success = false;
      res.json(response);
    })
}

exports.remove_post = function(req, res, next) {

  var post_id = req.params.post_id;
  var community_id = req.params.community_id;

  req.docRef
    .doc(post_id)
    .get()
    .then( (doc) => {
      s3.delete(doc.folderRef, (err, data) => {
        console.log('after s3 upload====', err, data);

        req.docRef
          .doc(post_id)
          .delete()
          .then(function() {
            res.json({success: true});
          }).catch(function(err) {
            console.error('Failed to delete post: ' + err);
            res.json({success:false});
          });
      });
    });
}

exports.set_post_comment = function(req, res, next) {

  //values from header or Post parameter
  // var user_id = req.body.user_id;
  // var text = req.body.comment;
  // console.log(req.body);
  var formData = req.body;

  var date = new Date(Date.now());
  // console.log(req);

  var post_comment = {
    ...formData,
    created: date
  }

  req.docRef.add(post_comment).then(function(docRef) {
    res.send(JSON.stringify({success: true}));
  }).catch(function(err) {
    console.error("Error adding comment: ", err);
    res.send(JSON.stringify({success: false}));
  });
}

exports.get_post_comment = function(req, res, next) {
  var response = {
    success: '',
    comment: ''
  }

  var comment_id = req.params.comment_id;

  req.docRef
    .doc(comment_id)
    .get()
    .then(function(doc) {
      response.comment = doc.data();
      response.success = true;
      res.json(response);
    }).catch(function(err) {
      console.error('Failed to get comment: ' + err);
      response.success = false;
      res.json(response);
    });
}

exports.get_post_comments = function(req, res, next) {
  var response = {
    success: false,
    list: {}
  }

  //Get post_id from header or GET parameter
  var post_id = req.param('post_id', null);

  //Get all comment relate to the post with id
  req.docRef
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        //Append comment object
        response.list[doc.id] = doc.data();
      });
      response.success = true;
      res.json(response);
    }).catch(function(err) {
      console.error('Failed to query comments: ' + err);
      response.success = false;
      res.json(response);
    });
}

exports.remove_post_comment = function(req, res, next) {

  var comment_id = req.params.comment_id;

  req.docRef
    .doc(comment_id)
    .delete()
    .then(function() {
      res.json({success: true});
    }).catch(function(err) {
      console.error('Failed to delete comment: ' + err);
      res.json({success: false});
    });
}
