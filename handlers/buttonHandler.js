const ClaimTask = require("../models/ClaimTask");
const KarmaRange = require("../models/KarmaRange");

module.exports = async (interaction, client) => {
  if (!interaction.customId.startsWith("claim_")) return;

  await interaction.deferReply({ flags: 64 });

  const taskId = interaction.customId.split("_")[1];

  const task = await ClaimTask.findOne({ taskId });

  if (!task) {
    return interaction.editReply("❌ Task not found");
  }

  const rangeOrder = {
    A: 1,
    B: 2,
    C: 3,
  };

  const userRanges = await KarmaRange.find({
    "users.userId": interaction.user.id,
  });

  const eligible = userRanges.some(
    (r) => rangeOrder[r.rangeCode] >= rangeOrder[task.range],
  );

  if (!eligible) {
    return interaction.editReply("❌ Not eligible");
  }

  // atomic claim
  const updatedTask = await ClaimTask.findOneAndUpdate(
    {
      taskId,
      "claimedBy.userId": { $ne: interaction.user.id },
      $expr: { $lt: [{ $size: "$claimedBy" }, "$slots"] },
    },
    {
      $push: {
        claimedBy: {
          userId: interaction.user.id,
          name: interaction.member.displayName,
        },
      },
    },
    { returnDocument: "after" },
  );

  if (!updatedTask) {
    return interaction.editReply(
      "⚠️ Already claimed OR slots full. No need to try again. This task will not be assigned to you.",
    );
  }

  const index = updatedTask.claimedBy.length - 1;

  const comment =
    updatedTask.comments[index] ||
    "Draft the comment by yourself. Make it look original and human-written! Do not copy-paste from ChatGPT!! Write a natural comment (no copy paste).";

  try {
    await interaction.user.send(
      `📌 Task ID: ${updatedTask.taskId}
👨‍💼 Admin: ${updatedTask.adminName}
💰 Price: ${updatedTask.price}
🔗 Link: ${updatedTask.postLink}

💬 ${comment}`,
    );
  } catch {
    return interaction.editReply("❌ Enable DMs first");
  }

  await interaction.editReply("✅ Task claimed. Check DM");

  if (updatedTask.claimedBy.length >= updatedTask.slots) {
    try {
      const channel = await client.channels.fetch(updatedTask.channelId);

      const msg = await channel.messages.fetch(updatedTask.messageId);

      await msg.delete();
    } catch {}
  }
};
