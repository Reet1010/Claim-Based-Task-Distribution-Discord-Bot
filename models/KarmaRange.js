const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Added required for index reliability
    name: String,
    redditLink: String,
    admin: String,
  },
  { _id: false },
);

const karmaRangeSchema = new mongoose.Schema(
  {
    rangeCode: {
      type: String,
      unique: true,
      required: true,
    },
    users: [userSchema],
  },
  { versionKey: false },
);

// This allows MongoDB to find the user across all ranges instantly
karmaRangeSchema.index({ "users.userId": 1 });

// Compound index: dramatically speeds up the "remove from one, add to another" logic
karmaRangeSchema.index({ rangeCode: 1, "users.userId": 1 });

module.exports = mongoose.model("KarmaRange", karmaRangeSchema);
