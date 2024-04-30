// schemas/post.js
const { GraphQLError } = require("graphql");
const Post = require("../model/post");
const { ObjectId } = require("mongodb");
const redis = require("../config/redis");

const typeDefs = `#graphql
type Post {
  _id: ID!
  content: String!
  tags: [String]!
  imgUrl: String
  authorId: ID!
  comments: [CommentDetail]
  likes: [likeDetail]
  createdAt: String
  updatedAt: String
}

type addPost {
  content: String!
  tags: [String]!
  imgUrl: String
  authorId: ID!
  comments: [String]!
  likes: [String]!
  createdAt: String
  updatedAt: String
}

type CommentDetail {
  authorId: ID
  content: String
  createdAt: String
  updatedAt: String
}

type likeDetail {
  authorId: ID
  createdAt: String
  updatedAt: String
}

type Query {
    getPosts: PostsResponse!
    getPostById(_id: ID!): PostResponse
}

input PostInput {
    content: String!
    tags: [String]!
    imgUrl: String!
    comments: [String]!
    likes: [String]!
}

type Mutation {
    addPost(input: PostInput!): AddPostResponse!
    commentPost(_id: ID!, comment: String!): ResponseCommentMutation!
    likePost(_id: ID!): ResponseLikeMutation!
}
`;

const resolvers = {
  Query: {
    getPosts: async () => {
      let result;
      const redisKey = "posts:sortedByCreatedAt";

      try {
        const postCache = await redis.get(redisKey);
        if (postCache) {
          result = JSON.parse(postCache);
          console.log("from cache");
        } else {
          const posts = await Post.getPostsByCreatedAt();
          await redis.set(redisKey, JSON.stringify(posts));
          result = posts;
          console.log("from mongodb");
        }

        console.log("result", result);

        return {
          statusCode: 200,
          message: "Posts retrieved successfully.",
          data: result,
          error: null,
        };
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw new GraphQLError("Failed to get posts");
      }
    },

    getPostById: async (_, { _id }) => {
      const redisKey = `post:${_id}`;
      try {
        let post = await redis.get(redisKey);
        if (post) {
          console.log("from cache");
          post = JSON.parse(post);
        } else {
          post = await Post.getPostByIdWithUserDetails(_id);
          if (post) {
            await redis.set(redisKey, JSON.stringify(post));
            console.log("from mongodb");
          }
        }

        if (!post) {
          return {
            statusCode: 404,
            message: "Post not found",
            data: null,
            error: "Post with the provided ID does not exist.",
          };
        }

        return {
          statusCode: 200,
          message: "Post retrieved successfully",
          data: post,
          error: null,
        };
      } catch (error) {
        console.error("Error in getPostById:", error);
        throw new GraphQLError("Failed to get post");
      }
    },
  },
  Mutation: {
    addPost: async (_, { input }, context) => {
      try {
        const authUser = await context.doAuthentication();

        if (!input.content) {
          throw new GraphQLError("Content is required for creating a post.");
        }

        if (!authUser.id) {
          throw new GraphQLError("Author ID is required for creating a post.");
        }

        const newPostData = {
          content: input.content,
          tags: input.tags,
          imgUrl: input.imgUrl,
          authorId: new ObjectId(authUser.id),
          comments: input.comments,
          likes: input.likes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const result = await Post.collection().insertOne(newPostData);

        if (!result.insertedId) {
          throw new GraphQLError("Failed to create new post");
        }

        const addedPost = await Post.findById(result.insertedId);

        // Invalidate relevant caches
        await redis.del("posts:sortedByCreatedAt");

        return {
          statusCode: 200,
          message: "Post created successfully",
          data: addedPost,
          error: null,
        };
      } catch (error) {
        console.error("Error in addPost mutation:", error);
        return {
          statusCode: 500,
          message: "Failed to create new post",
          error: error.message,
          data: null,
        };
      }
    },

    commentPost: async (_, { _id, comment }, context) => {
      try {
        const authUser = await context.doAuthentication();
        const userId = authUser.id;

        const newComment = {
          authorId: new ObjectId(userId),
          commentText: comment,
        };

        const updatedPost = await Post.addComment(_id, newComment);
        if (!updatedPost) {
          throw new GraphQLError("Failed to add comment: Post not found");
        }

        // Invalidate Redis cache
        const postCacheKey = `post:${_id}`;

        await redis.set(postCacheKey, JSON.stringify(updatedPost));

        return {
          statusCode: 200,
          message: "Comment added successfully",
          data: updatedPost,
          error: null,
        };
      } catch (error) {
        console.error("Error in commentPost mutation:", error);
        throw new GraphQLError("Failed to add comment");
      }
    },

    likePost: async (_, { _id }, context) => {
      try {
        const authUser = await context.doAuthentication();
        const userId = authUser.id;

        const updatedPost = await Post.likePost(_id, userId);
        if (!updatedPost) {
          throw new GraphQLError("Failed to like post: Post not found");
        }

        if (updatedPost.likes.length > 1) {
          throw new GraphQLError("Failed to like post: Post already liked");
        }

        // Invalidate Redis cache
        const postCacheKey = `post:${_id}`;

        await redis.set(postCacheKey, JSON.stringify(updatedPost));

        return {
          statusCode: 200,
          message: "Post liked successfully",
          data: updatedPost,
          error: null,
        };
      } catch (error) {
        console.error(`Error in likePost mutation for post ID ${_id}:`, error);
        throw new GraphQLError("Failed to like post");
      }
    },
  },
};

module.exports = {
  postTypeDefs: typeDefs,
  postResolvers: resolvers,
};
