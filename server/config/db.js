//config/db.js
const { MongoClient } = require("mongodb");

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://amaralkaff:ZqlORhSS9tJjy6ry@cluster0.ohi26fq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const dbName = "XApp";

async function connect() {
  try {
    await client.connect();
    console.log("Successfully to connect mongodb");
    return client;
  } catch (error) {
    await client.close();
    throw error;
  }
}

function getDatabase() {
  return client.db(dbName);
}

module.exports = {
  connect,
  getDatabase,
  client,
};
