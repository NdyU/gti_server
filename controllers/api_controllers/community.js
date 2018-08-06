const jwt = require('jwt-simple');
const config = require('./../../config');
const fs = require('fs');
const s3 = require('./../../services/aws-s3/methods');

exports.create_community = function(req, res, next) {

  console.log(req.body);

  var community_name = req.body.community_name;
  var image_name = req.file.filename;

  console.log(req.file);

  var folderRef = `community/images/${req.file.filename}`;
  s3.upload(req.file, folderRef, function(err, data) {
    console.log('after s3 upload====', err, data);

    var date = new Date(Date.now());

    var community_info = {
      displayName: community_name,
      imageName: data.Location,
      folderRef: folderRef,
      created: date
    }

    community_name = community_name.toLowerCase();
    community_name = community_name.replace(new RegExp(" ", "g"), "");

    req.docRef.doc(community_name).set(community_info, {merge: true}).then(function(docRef) {
      res.json({success: true});
    }).catch(function(err) {
      console.error("Error adding community: ", err);
      res.json({success: false});
    });
  });
}

exports.get_community_info = function(req, res, next) {

  var community_name = req.params.community_id;

  var community_info = {
    success: '',
    community: {},
  };

  req.docRef.doc(community_name).get().then(function(doc) {
    community_info.success = true;
    community_info.community = doc.data();
    console.log(community_info);
    res.json(community_info);
  }).catch(function(err) {
    console.error("Error finding the community: ", err);
    community_info.success=false;
    res.json(community_info);
  });
}

exports.get_community_list = function(req, res, next) {

  var community = {
    success: '',
    list: {}
  };

  req.docRef.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      community.list[doc.id] = doc.data();
    });
    community.success = true;
    res.json(community);
  }).catch(function(err) {
    console.error('Error retrieving community: ', err);
    community.success = false;
    res.json(community);
  });
}

exports.remove_community = function(req, res, next) {

  var community_id = req.params.community_id;

  req.docRef
    .doc(community_id)
    .get()
    .then(function(doc) {
      var imageName = doc.data().imageName;
      var folderRef = doc.data().folderRef;

      s3.delete(folderRef, (err, data) => {
        if (err) console.log(err, err.stack);
        //Delete the document in the database, Subcollections will not be deleted
        req.docRef
          .doc(community_id)
          .delete()
          .then(function() {
            res.json({success: true})
          }).catch(function(err) {
            console.error('Failed to delete community: ' + err);
            res.json({success: false});
          });
      })
      //Delete the image for the community, async function
      // fs.unlink(image_url, (err) => {
      //  if(err) throw err;
      // });
    }).catch(function(err) {
      console.error('Failed to get community: ' + err);
      res.json({success: false});
    });

}

exports.add_user_to_community = function(req, res, next) {

  var user_id = req.params.user_id;

  var user_info = {
    user_id: user_id
  }

  console.log("New user added to community");

  req.docRef.doc(user_id).set({displayName: 'Community Display Name'}).then(function(docRef) {
    res.json({success: true});
  }).catch(function(err) {
    console.error("Fail to add user to community: " + err);
    res.json({success: false});
  });
}

exports.get_online_users_in_community = function(req, res, next) {

  var communityDocRef = req.param('community_id', null);

  var response = {
    list: {},
    success: '',
    community_id: '',
    count: 0
  }

  response.community_id = communityDocRef;

  var user_count = 0;

  req.docRef
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        response.list[doc.id] = doc.data();
        user_count++;
      });
      response.success = true;
      response.count = user_count;

      res.json(response);
    }).catch(function(err) {
      console.error('Fail to query users in community: ' + error);

      reponse.success = false;
      res.json(response);
    });
}

exports.remove_user_from_community = function(req, res, next) {

  var community_id = req.param('community_id', null);

  var user_id = req.param('user_id', null);

  req.docRef
    .where('user_id', '==', user_id)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete().then(function() {
          res.json({success: true})
        }).catch(function(err) {
          console.error('Fail to delete user in community: ' + err);
          res.json({success: false});
        });
      });
    });

}
