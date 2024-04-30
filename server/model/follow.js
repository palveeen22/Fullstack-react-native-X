// model/follow.js
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/db");
const { GraphQLError } = require("graphql");

class Follow {
  static collection() {
    const database = getDatabase();
    return database.collection("follows");
  }

  static async followUser(userId, followUserId) {
    try {
      const follow = await this.collection().findOne({
        followingId: new ObjectId(userId),
        followerId: new ObjectId(followUserId),
      });

      if (follow) {
        return {
          alreadyFollowed: true,
          message: "You already followed this user",
        };
      }

      const newFollow = await this.collection().insertOne({
        followingId: new ObjectId(userId),
        followerId: new ObjectId(followUserId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (!newFollow.insertedId) {
        throw new GraphQLError("Failed to follow user");
      }

      const followData = await this.collection().findOne({
        _id: new ObjectId(newFollow.insertedId),
      });

      console.log("followData", followData);
      return followData;
    } catch (error) {
      console.error("Error following user:", error);
      throw new GraphQLError("Failed to follow user");
    }
  }
}

module.exports = Follow;
