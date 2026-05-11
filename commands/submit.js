const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "submit",

  async execute(interaction) {
    if (interaction.channel.id !== process.env.TASK_SUBMIT_CHANNEL_ID) {
      return interaction.reply({
        content: "❌ Use in task-submission channel",
        flags: 64,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId("submitModal")
      .setTitle("Submit Task");

    const taskId = new TextInputBuilder()
      .setCustomId("taskId")
      .setLabel("Task ID")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const admin = new TextInputBuilder()
      .setCustomId("admin")
      .setLabel("Admin Name")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const post = new TextInputBuilder()
      .setCustomId("post")
      .setLabel("Post Link")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const comment = new TextInputBuilder()
      .setCustomId("comment")
      .setLabel("Comment Link")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(
      new ActionRowBuilder().addComponents(taskId),
      new ActionRowBuilder().addComponents(admin),
      new ActionRowBuilder().addComponents(post),
      new ActionRowBuilder().addComponents(comment),
    );

    await interaction.showModal(modal);
  },
};
