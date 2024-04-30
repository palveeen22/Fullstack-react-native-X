//model/post.js
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/db");
const { GraphQLError } = require("graphql");
const User = require("./user");

class Post {
  static collection() {
    const database = getDatabase();
    const postCollection = database.collection("posts");

    return postCollection;
  }

  static async addPost(payload = {}) {
    try {
      const newPost = await this.collection().insertOne(payload);

      const post = await this.findById(newPost.insertedId);

      return post;
    } catch (error) {
      console.error("Error adding post:", error);
      throw new GraphQLError("Failed to add post");
    }
  }

  static async getPostsByCreatedAt() {
    try {
      const posts = await this.collection()
        .find({ createdAt: { $exists: true, $ne: null } })
        .sort({ createdAt: -1 })
        .toArray();

      return posts;
    } catch (error) {
      console.error("Error getting posts by createdAt:", error);
      throw new GraphQLError("Failed to get posts");
    }
  }

  static async findById(id) {
    try {
      const post = await this.collection().findOne({ _id: new ObjectId(id) });
      if (!post) {
        throw new GraphQLError("Post not found");
      }
      return post;
    } catch (error) {
      console.error("Error finding post by ID:", error);
      throw new GraphQLError("Failed to get post");
    }
  }

  static async addComment(postId, comment) {
    try {
      const { authorId, commentText } = comment;

      const user = await User.findById(authorId);
      if (!user) throw new Error("User not found");

      const commentToAdd = {
        authorId: new ObjectId(authorId),
        content: commentText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await this.collection().updateOne(
        { _id: new ObjectId(postId) },
        { $push: { comments: commentToAdd } }
      );

      console.log("result", result);

      if (result.modifiedCount === 0) {
        throw new GraphQLError("Failed to add comment");
      }
      return this.findById(postId);
    } catch (error) {
      console.error("Error adding comment:", error);
      throw new GraphQLError("Failed to add comment");
    }
  }

  static async likePost(postId, userId) {
    try {
      const likeToAdd = {
        authorId: new ObjectId(userId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!likeToAdd.authorId) {
        throw new GraphQLError("Author ID is required for liking a post.");
      }

      const result = await this.collection().updateOne(
        { _id: new ObjectId(postId) },
        { $push: { likes: likeToAdd } }
      );

      if (result.modifiedCount === 0) {
        throw new GraphQLError("Failed to like post");
      }

      if (result.modifiedCount === 0) {
        throw new GraphQLError("Failed to like post");
      }

      return this.findById(postId);
    } catch (error) {
      console.error("Error liking post:", error);
      throw new GraphQLError("Failed to like post");
    }
  }
  static async getPostByIdWithUserDetails(postId) {
    try {
      const postAggregation = await this.collection()
        .aggregate([
          { $match: { _id: new ObjectId(postId) } },
          {
            $lookup: {
              from: "users",
              let: { commentIds: "$comments.userId", likeIds: "$likes" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $or: [
                        { $in: ["$_id", "$$commentIds"] },
                        { $in: ["$_id", "$$likeIds"] },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    username: 1,
                  },
                },
              ],
              as: "userDetails",
            },
          },
          {
            $addFields: {
              comments: {
                $map: {
                  input: "$comments",
                  as: "comment",
                  in: {
                    text: "$$comment.text",
                    userId: "$$comment.userId",
                    user: {
                      $arrayElemAt: [
                        "$userDetails",
                        {
                          $indexOfArray: [
                            "$userDetails._id",
                            "$$comment.userId",
                          ],
                        },
                      ],
                    },
                  },
                },
              },
              likes: {
                $map: {
                  input: "$likes",
                  as: "like",
                  in: {
                    _id: "$$like",
                    user: {
                      $arrayElemAt: [
                        "$userDetails",
                        { $indexOfArray: ["$userDetails._id", "$$like"] },
                      ],
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              content: 1,
              tags: 1,
              imgUrl: 1,
              authorId: 1,
              createdAt: 1,
              updatedAt: 1,
              comments: {
                $map: {
                  input: "$comments",
                  as: "comment",
                  in: {
                    text: "$$comment.text",
                    user: "$$comment.user",
                  },
                },
              },
              likes: "$likes.user",
            },
          },
        ])
        .toArray();

      return postAggregation[0] || null;
    } catch (error) {
      console.error("Error in getPostByIdWithUserDetails:", error);
      throw new GraphQLError("Failed to get post details");
    }
  }
}
module.exports = Post;
