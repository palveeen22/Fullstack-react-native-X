//utils/auth.js
const { GraphQLError } = require("graphql");
const { verifyToken } = require("./jwt");
const User = require("../model/user");

const authentication = async (req) => {
  const headerAuthorization = req.headers.authorization;

  if (!headerAuthorization) {
    throw new GraphQLError("Authorization header is missing");
  }

  const [bearer, token] = headerAuthorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    throw new GraphQLError("Invalid token format");
  }

  const payload = verifyToken(token);
  const user = await User.findOne({ email: payload.email }, true);

  if (!user) {
    throw new GraphQLError("Invalid token");
  }

  return {
    id: user._id,
    email: user.email,
  };
};

module.exports = authentication;
