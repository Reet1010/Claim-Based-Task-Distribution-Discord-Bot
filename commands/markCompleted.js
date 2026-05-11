const { MessageFlags } = require("discord.js");
const { processCompletion } = require("../services/submissionService");

module.exports = {
  name: "markcompleted",

  async execute(interaction) {
    await interaction.deferReply({ flags: 64 });

    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.editReply("❌ Only admins");
    }

    if (interaction.channel.id !== process.env.TASK_RECORDS_CHANNEL_ID) {
      return interaction.editReply("❌ Use in task-records channel");
    }

    try {
      await processCompletion(interaction);
      await interaction.editReply("✅ Marked completed");
    } catch (err) {
      await interaction.editReply(err.message || "❌ Error");
    }
  },
};
