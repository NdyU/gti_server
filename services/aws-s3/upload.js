const fs = require('fs');

const s3 = require('./index.js');

const buckets = {
  community: '',
  post: ''
}

module.exports = function(file, folderRef, callback) {
  console.log('Uploading Image to cloud storage');

  var pathToFile = `${file.destination}/${file.filename}`;

  var bodystream = fs.createReadStream(pathToFile);

  console.log(bodystream);
  
  var params = {
    Bucket: 'elasticbeanstalk-us-east-2-355674520256',
    Key: `${folderRef}/images/${file.filename}`,
    Body: bodystream,
    ACL: 'public-read',
    ContentEncoding: file.encoding,
    ContentType: file.mimetype,
    Metadata: {
      'contentType': file.mimetype  //x-amz-meta-contenttype
    }
  };

  s3.upload(params, callback);
}
