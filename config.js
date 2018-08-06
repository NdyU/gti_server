//Environment varaibles can be config using dotenv package

module.exports = {
  client: {
    url: process.env.GTI_APP_CLIENT_DOMAIN
  },
  secret: process.env.GTI_SECRET,
  firebase_api_key: process.env.FIREBASE_API_KEY,
  firebase_auth_domain: process.env.FIREBASE_AUTH_DOMAIN,
  firebase_project_id: process.env.FIREBASE_PROJECT_ID,
  firebase_storage_bucket: process.env.FIREBASE_CLOUD_STORAGE,
  google_oauth_client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
  google_oauth_client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  aws_s3_bucket: process.env.AWS_GTI_BUCKET,
  node_env: process.env.NODE_ENV
}
