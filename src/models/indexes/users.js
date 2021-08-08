module.exports = async (db) => {
  const indexes = [];

  indexes.push({
    key: {
      fullName: 1,
      dob: 1,
      status: 1,
      type: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  });

  return await db.collection("users").createIndexes(indexes);
};
