const mongoDb = require("../db");

class Repository {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  collection() {
    return mongoDb.instance().collection(this.collectionName);
  }

  find(query, options) {
    return this.collection().find(query, options).toArray();
  }

  aggregate(pipeline, options) {
    return this.collection().aggregate(pipeline, options).toArray();
  }
}

exports.Repository = Repository;
