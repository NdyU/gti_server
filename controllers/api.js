
const communityController = require('./api_controllers/community');
const postController = require('./api_controllers/post');
const imageController = require('./api_controllers/image');

exports.image = {
  GET: imageController.get_image
}
exports.community = {
  CREATE: communityController.create_community,
  GET: communityController.get_community_info,
  GET_LIST: communityController.get_community_list,
  REMOVE: communityController.remove_community,

  user: {
    CREATE: communityController.add_user_to_community,
    // GET_USER: communityController.get_user_in_community,
    GET_LIST: communityController.get_online_users_in_community,
    REMOVE: communityController.remove_user_from_community
  },
  post: {// Nested inside the community entitiy for now
    CREATE: postController.create_post,
    GET: postController.get_post,
    GET_LIST: postController.get_posts,
    REMOVE: postController.remove_post,

    comment: {
      CREATE: postController.set_post_comment,
      GET: postController.get_post_comment,
      GET_LIST: postController.get_post_comments,
      REMOVE: postController.remove_post_comment
    }
  }
}
