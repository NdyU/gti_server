const AWS = require('aws-sdk');
// const bluebird = require('bluebird');

const config = require('./../../config');

//aws credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = config.aws_access_key_id;
AWS.config.secretAccessKey = config.aws_secret_access_key;
AWS.config.region = "us-east-2";
AWS.config.apiVersions = { "s3": "2006-03-01" }
// AWS.config.setPromisesDependency(bluebird);
var s3 = new AWS.S3();
 
module.exports = s3;
