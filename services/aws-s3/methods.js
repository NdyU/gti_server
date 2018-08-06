const fs = require('fs');
const config = require('./../../config');

const s3 = require('./index.js');

const bucket = config.aws_s3_bucket;

module.exports = {
  upload: (file, folderRef, callback) => {
    console.log('Uploading Image to cloud storage');

    var pathToFile = `${file.destination}/${file.filename}`;

    var bodystream = fs.createReadStream(pathToFile);

    console.log(bodystream);

    console.log('Bucket: ', bucket);
    var params = {
      Bucket: bucket,
      Key: `${folderRef}`,  //Where the file reside inside s3 bucket
      Body: bodystream,
      ACL: 'public-read', // make the file publicly accessible through the url link
      ContentEncoding: file.encoding,
      ContentType: file.mimetype, // Must be the right type inorder to view image
      Metadata: {
        'contentType': file.mimetype  //x-amz-meta-contenttype
      }
    };

    s3.upload(params, callback);
  },
  delete: (pathToFile, callback) => {
    var params = {
      Bucket: bucket,
      Key: pathToFile
    }
    s3.deleteObject(params, callback);
  }
}
