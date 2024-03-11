const redis = require("redis");

// Create Redis client with error handling
const client = redis.createClient();

// client.on("error", (err) => {
//   console.error("Redis Client Error:", err);
// });

// Connect method to establish connection
// const connect = async () => {
//   await new Promise((resolve, reject) => {
//     client.on("connect", () => {
//       console.log("Redis connected successfully");
//       resolve();
//     });
//     client.on("error", (err) => {
//       console.error("Error connecting to Redis:", err);
//       reject(err);
//     });
//   });
// };

const connect = async () => {
  await client.connect();
  console.log("Redis connected");
};

module.exports = {
  client,
  connect,
};
