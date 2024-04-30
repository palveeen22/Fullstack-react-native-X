//model/user.js
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/db");
const { hashPassword } = require("../utils/bcrypt");
const { GraphQLError } = require("graphql");

class User {
  static collection() {
    const database = getDatabase();
    const userCollection = database.collection("users");

    return userCollection;
  }

  static async findOne(filterQuery = {}, hidePassword = false) {
    const options = {};

    if (hidePassword) {
      options.projection = {
        password: 0,
      };
    }

    const user = await this.collection().findOne(filterQuery, options);

    return user;
  }

  static async searchByUsername(username) {
    const regex = new RegExp(username, "i");
    return await this.collection()
      .find({ username: { $regex: regex } }, { projection: { password: 0 } })
      .toArray();
  }

  static async findById(id, hidePassword = false) {
    const options = {};

    if (hidePassword) {
      options.projection = {
        password: 0,
      };
    }
    const user = await this.collection().findOne(
      {
        _id: new ObjectId(id),
      },
      options
    );

    return user;
  }

  static async createOne(payload = {}) {
    try {
      payload.password = hashPassword(payload.password);

      const newUser = await this.collection().insertOne(payload);

      const user = await this.findById(newUser.insertedId, true);

      return user;
    } catch (error) {
      throw new GraphQLError("Failed to create new user");
    }
  }

  static async getUserByIdWithFollowDetails(userId) {
    try {
      const userAggregation = await this.collection()
        .aggregate([
          { $match: { _id: new ObjectId(userId) } },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followerId",
              as: "followers",
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followingId",
              as: "following",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followers.followingId",
              foreignField: "_id",
              as: "followerDetails",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "following.followerId",
              foreignField: "_id",
              as: "followingDetails",
            },
          },
          {
            $project: {
              username: 1,
              email: 1,
              followers: {
                $map: {
                  input: "$followerDetails",
                  as: "fd",
                  in: {
                    _id: "$$fd._id",
                    username: "$$fd.username",
                  },
                },
              },
              following: {
                $map: {
                  input: "$followingDetails",
                  as: "fd",
                  in: {
                    _id: "$$fd._id",
                    username: "$$fd.username",
                  },
                },
              },
            },
          },
        ])
        .toArray();

      return userAggregation[0] || null;
    } catch (error) {
      console.error("Error in getUserByIdWithFollowDetails:", error);
      throw new GraphQLError("Failed to get user details");
    }
  }
}

module.exports = User;
