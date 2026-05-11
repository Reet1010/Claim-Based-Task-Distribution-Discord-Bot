const KarmaRange = require("../models/KarmaRange");

exports.addUserToRange = async (user, redditLink, rangeCode, admin) => {
  try {
    await KarmaRange.bulkWrite([
      // Step 1: Remove user from ANY range they might already be in
      {
        updateMany: {
          filter: { "users.userId": user.id }, // Targeted filter is faster than {}
          update: { $pull: { users: { userId: user.id } } },
        },
      },
      // Step 2: Add user to the SPECIFIC range
      {
        updateOne: {
          filter: { rangeCode },
          update: {
            $addToSet: {
              users: {
                userId: user.id,
                name: user.displayName,
                redditLink,
                admin,
              },
            },
          },
          upsert: true,
        },
      },
    ]);
  } catch (error) {
    console.error("Error in addUserToRange:", error);
    throw error; // Rethrow so the stress test can catch the failure
  }
};
