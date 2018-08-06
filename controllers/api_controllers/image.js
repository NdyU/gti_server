const config = require('./../../config');
var path = require('path');

exports.get_image = function(req, res, next) {

  var filename = req.params.filename;
  var type = req.params.type;

  var root_path = path.join(__dirname, ('../../uploads/' + type) );

  res.sendFile(filename, {root: root_path});
}
