const ClaimTask = require("../models/ClaimTask");
const CompletedSubmission = require("../models/CompletedSubmission");
const { addRow } = require("../sheets");

exports.processCompletion = async (interaction) => {
  const taskId = interaction.options.getString("taskid");

  const postLink = interaction.options.getString("post");

  const comment = interaction.options.getString("comment");

  const user = interaction.options.getUser("user");

  const adminName = interaction.member.displayName;

  const adminId = interaction.member.id;

  const task = await ClaimTask.findOne({
    taskId,
    adminName,
    postLink,
  });

  if (!task) {
    throw new Error("❌ Task not found");
  }

  const valid = task.claimedBy.some((u) => u.userId === user.id);

  if (!valid) {
    throw new Error("❌ User not found in claimed list");
  }

  const member = await interaction.guild.members.fetch(user.id);

  const completed = await CompletedSubmission.findOneAndUpdate(
    {
      adminName,
      taskId,
      userId: user.id,
    },
    {
      $setOnInsert: {
        taskId,
        adminName,
        adminId,
        userId: user.id,
        userName: member.displayName,
        postLink,
        commentLink: comment,
        price: task.price,
      },
    },
    {
      upsert: true,
      returnDocument: "before",
    },
  );

  if (completed) {
    throw new Error("❌ Already completed");
  }

  const now = new Date();

  await addRow(adminName, [
    taskId,
    member.displayName,
    postLink,
    comment,
    now.toLocaleDateString(),
    now.toLocaleTimeString(),
    task.price,
    "pending",
  ]);
};
