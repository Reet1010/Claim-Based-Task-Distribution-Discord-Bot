const mongoose = require("mongoose");

const completedSubmissionSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
    },

    adminName: {
      type: String,
      required: true,
    },

    adminId: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    userName: String,

    postLink: String,
    commentLink: String,

    price: String,

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

// duplicate protection
completedSubmissionSchema.index(
  {
    adminName: 1,
    taskId: 1,
    userId: 1,
  },
  { unique: true },
);

module.exports = mongoose.model(
  "CompletedSubmission",
  completedSubmissionSchema,
);
