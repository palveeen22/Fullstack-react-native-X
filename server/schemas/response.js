//schemas/response.js
const typeDefs = `#graphql
  interface Response {
    statusCode: Int!
    message: String
    error: String
  }

  type UserLoginData {
    token: String
    userId: ID
  }

  type ResponseUserLogin implements Response {
    statusCode: Int!
    message: String
    error: String
    data: UserLoginData
  }

  type ResponseUser implements Response {
    statusCode: Int!
    message: String
    error: String
    data: User
  }

  type ResponseById implements Response {
    statusCode: Int!
    message: String
    error: String
    data: User
  }

  type UserResponse implements Response {
    statusCode: Int!
    message: String
    error: String
    data: User
  }

  type ResponsePost implements Response {
    statusCode: Int!
    message: String
    error: String
    data: Post
  }

  type ResponsePostMutation implements Response {
    statusCode: Int!
    message: String
    error: String
    data: Post
  }

  type PostsResponse implements Response {
    statusCode: Int!
    message: String
    error: String
    data: [Post]
  }

  type PostResponse implements Response {
    statusCode: Int!
    message: String
    error: String
    data: Post
  }

  type ResponseComment implements Response {
    statusCode: Int!
    message: String
    error: String
    data: Post
  }
  

  type FollowResponse implements Response {
    statusCode: Int!
    message: String
    error: String
    data: FollowData
  }

  type FollowData {
    followingId: ID!
    followerId: ID!
    createdAt: String!
    updatedAt: String!
  }


  type AddPostResponse implements Response {
    statusCode: Int!
    message: String
    error: String
    data: addPost
  }

  type ResponseCommentMutation implements Response {
    statusCode: Int!
    message: String
    error: String
    data: CommentDetail
  }

  type ResponseLikeMutation implements Response {
    statusCode: Int!
    message: String
    error: String
    data: likeDetail
  }

  

  `;

module.exports = {
  responseTypeDefs: typeDefs,
};
