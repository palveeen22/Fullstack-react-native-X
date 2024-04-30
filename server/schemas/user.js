// schemas/user.js
const { GraphQLError } = require("graphql");
const User = require("../model/user");
const Follow = require("../model/follow");
const { comparePassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jwt");
const { ObjectId } = require("mongodb");

const typeDefs = `#graphql
  type User {
    _id: ID
    username: String
    email: String
    followers: [followerDetails]  
    following: [followingDetails]  
  }

  type followerDetails {
    _id: ID
    username: String
  }

  type followingDetails {
    _id: ID
    username: String
  }

  type Query {
    login(email: String!, password: String!): ResponseUserLogin 
    getUser(_id: ID!): ResponseById
    searchUsersByUsername(username: String!): [User]
    currentUser: UserResponse
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input GetUserIdInput {
    _id: ID!
  }
  
  type Mutation {
    register(input: RegisterInput): ResponseUser
  }
`;

const resolvers = {
  Query: {
    login: async (_, args) => {
      try {
        const { email, password } = args;

        const user = await User.findOne({ email });

        if (!user || !comparePassword(password, user.password)) {
          throw new GraphQLError("Invalid username or password");
        }

        const payload = {
          id: user._id,
          email: user.email,
        };

        const token = generateToken(payload);

        return {
          statusCode: 200,
          message: `Successfully to login`,
          data: {
            token,
            userId: user._id,
          },
        };
      } catch (error) {
        throw new GraphQLError("Failed to login");
      }
    },
    getUser: async (_, { _id }) => {
      try {
        const user = await User.getUserByIdWithFollowDetails(_id);
        if (!user) {
          throw new GraphQLError("User not found");
        }
        return {
          statusCode: 200,
          message: `Successfully to get user`,
          data: user,
        };
      } catch (error) {
        console.error("Error in getUser resolver:", error);
        throw new GraphQLError("Failed to get user");
      }
    },
    searchUsersByUsername: async (_, { username }) => {
      try {
        return await User.searchByUsername(username);
      } catch (error) {
        console.error("Error in searchUsersByUsername query:", error);
        throw new GraphQLError("Failed to search users");
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      try {
        const { username, email, password } = args.input;

        // require
        if (!username || !email || !password) {
          throw new GraphQLError("Username, email, and password are required");
        }

        // unique email
        if (await User.findOne({ email })) {
          throw new GraphQLError("Email already exists");
        }

        // unique username
        if (await User.findOne({ username })) {
          throw new GraphQLError("Username already exists");
        }

        //email format
        const emailFormat = /\S+@\S+\.\S+/;
        if (!emailFormat.test(email)) {
          throw new GraphQLError("Email format is not valid");
        }

        //password length
        if (password.length < 5) {
          throw new GraphQLError("Password must be at least 5 characters");
        }

        const user = await User.createOne({
          username,
          email,
          password,
        });

        return {
          statusCode: 200,
          message: `Successfully to register`,
          data: user,
        };
      } catch (error) {
        throw new GraphQLError("Failed to Register");
      }
    },
    followUser: async (_, { userId, followUserId }) => {
      try {
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(followUserId)) {
          throw new GraphQLError("Invalid user ID");
        }
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
  userTypeDefs: typeDefs,
  userResolvers: resolvers,
};
