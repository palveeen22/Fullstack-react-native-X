// schemas/follow.js
const { GraphQLError } = require("graphql");
const Follow = require("../model/follow");
const redis = require("../config/redis");

const typeDefs = `#graphql
  extend type Mutation {
    followUser(userId: ID!, followUserId: ID!): FollowResponse
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
`;

const resolvers = {
  Mutation: {
    followUser: async (_, { userId, followUserId }) => {
      try {
        const redisKey = `follow:${userId}:${followUserId}`;
        const redisValue = await redis.get(redisKey);
        if (redisValue) {
          return {
            statusCode: 409,
            message: "You already followed this user",
            data: null,
            error: null,
          };
        }

        if (userId === followUserId) {
          return {
            statusCode: 409,
            message: "You cannot follow yourself",
            data: null,
            error: null,
          };
        }

        await redis.set(redisKey, true);

        const result = await Follow.followUser(userId, followUserId);
        return {
          statusCode: result.alreadyFollowed ? 409 : 201,
          message: result.message,
          data: result,
          error: null,
        };
      } catch (error) {
        console.error(`Error in followUser mutation:`, error);
        throw new GraphQLError("Failed to follow user");
      }
    },
  },
};

module.exports = {
  followTypeDefs: typeDefs,
  followResolvers: resolvers,
};
