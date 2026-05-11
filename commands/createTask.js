const { createAndPostTask } = require("../services/claimService");

module.exports = {
  name: "createtask",

  async execute(interaction) {
    await interaction.deferReply({ flags: 64 });

    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.editReply({
        content:
          "❌ Only admins can use this feature. And you are not that guy bro 😡",
        flags: 64,
      });
    }

    if (interaction.channel.id !== process.env.ADMIN_CHANNEL_ID) {
      return interaction.editReply({
        content: "❌ Use in admin channel only",
        flags: 64,
      });
    }

    const task = interaction.options.getString("taskid");
    const price = interaction.options.getString("price");
    const link = interaction.options.getString("link");
    const range = interaction.options.getString("range");
    const slots = interaction.options.getInteger("slots");
    const comments = interaction.options.getString("comments");
    const subReddit = interaction.options.getString("subreddit");
    const admin = interaction.member.displayName;

    await createAndPostTask(interaction, {
      task,
      price,
      link,
      range,
      slots,
      comments,
      subReddit,
    });

    await interaction.editReply(`✅ Task ${task} created by ${admin}`);
  },
};
