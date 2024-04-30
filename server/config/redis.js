// config/redis-config.js
const Redis = require("ioredis");

const redis = new Redis();

redis.on("connect", () => {
  console.log("Successfully to connect redis");
});

redis.on("error", (error) => {
  console.error("Error connecting to redis:", error);
});

module.exports = redis;
