module.exports = async (interaction, client) => {
  await interaction.deferReply({ flags: 64 });

  if (interaction.customId === "verifyModal") {
    const username = interaction.fields.getTextInputValue("redditUsername");

    const profileLink = interaction.fields.getTextInputValue("redditLink");

    const cqsLink = interaction.fields.getTextInputValue("cqspostlink");

    const channel = await client.channels.fetch(
      process.env.VERIFICATION_CHANNEL_ID,
    );

    await channel.send(
      `🆕 Verification Request

👤 ${interaction.user}
📛 ${username}
🔗 ${profileLink}
🔗 ${cqsLink}`,
    );

    return interaction.editReply("✅ Sent to admins");
  }

  if (interaction.customId === "submitModal") {
    const taskId = interaction.fields.getTextInputValue("taskId");

    const admin = interaction.fields.getTextInputValue("admin");

    const post = interaction.fields.getTextInputValue("post");

    const comment = interaction.fields.getTextInputValue("comment");

    const channel = await client.channels.fetch(
      process.env.TASK_RECORDS_CHANNEL_ID,
    );

    await channel.send(
      `📥 Submission

👨‍💼 Admin: ${admin}
👤 Member: ${interaction.member.displayName}
🆔 TaskID: ${taskId}
🔗 Post: ${post}
💬 Comment: ${comment}`,
    );

    return interaction.editReply("✅ Submitted");
  }
};
