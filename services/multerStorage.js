const multer = require('multer');

module.exports = {
  community: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/community');
    },
    filename: function(req, file, cb) {

      var community_name = req.body.community_name;
      var mimetype = file.mimetype;

      var file_type_info = mimetype.split('/');
      console.log(file_type_info);
      var file_type = file_type_info[0];

      if(file_type == 'image') {
        var file_extension = file_type_info[1];

        var new_file_name = community_name + '.' + file_extension;
        // console.log(file);
        cb(null, new_file_name);
      } else {
        console.error('File uplod is not an image');
        cb(null, 'badFileType');
      }
    }
  }),
  post: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/post');
    },
    filename: function(req, file, cb) {

      var title = req.body.title;
      var mimetype = file.mimetype;

      var file_type_info = mimetype.split('/');
      console.log(file_type_info);
      var file_type = file_type_info[0];

      if(file_type == 'image') {
        var file_extension = file_type_info[1];

        var new_file_name = title + '.' + file_extension;
        // console.log(file);
        cb(null, new_file_name);
      } else {
        console.error('File uplod is not an image');
        cb(null, 'badFileType');
      }
    }
  }),

}
