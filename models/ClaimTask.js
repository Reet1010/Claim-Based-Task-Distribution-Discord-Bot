const mongoose = require("mongoose");

const claimTaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
    },

    adminName: {
      type: String,
      required: true,
      index: true,
    },

    price: {
      type: String,
      required: true,
    },

    postLink: {
      type: String,
      required: true,
      index: true,
    },

    range: {
      type: String,
      required: true,
      index: true,
    },

    messageId: String,
    channelId: String,

    slots: {
      type: Number,
      required: true,
      min: 1,
    },

    comments: {
      type: [String],
      default: [],
    },

    claimedBy: {
      type: [
        {
          userId: String,
          name: String,
        },
      ],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

claimTaskSchema.index({ "claimedBy.userId": 1 });

claimTaskSchema.index({
  taskId: 1,
  adminName: 1,
  postLink: 1,
});

module.exports = mongoose.model("ClaimTask", claimTaskSchema);
