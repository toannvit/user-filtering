const MongoClient = require("mongodb").MongoClient;
const createUserIndexes = require("./indexes/users");

let db = undefined;

exports.connect = async (uri, dbName) => {
  try {
    uri = uri || "mongodb://localhost:27017";
    dbName = dbName || "filtering";

    const client = await MongoClient.connect(uri, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 0,
      keepAlive: true,
      keepAliveInitialDelay: 2000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to uri: ${uri}/${dbName}`);

    db = client.db(dbName);

    await Promise.all([createUserIndexes(db)]);
  } catch (error) {
    console.log("Failed to connect to database");
    console.log(error);
    return;
  }
};

exports.instance = () => {
  if (!db) {
    throw new Error("Failed to connect to databse");
  }
  return db;
};
