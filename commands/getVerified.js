const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "getverified",

  async execute(interaction) {
    if (interaction.channel.id !== process.env.CLAIM_CHANNEL_ID) {
      return interaction.reply({
        content: "❌ Use this command only in general channel",
        flags: 64,
      });
    }
    const modal = new ModalBuilder()
      .setCustomId("verifyModal")
      .setTitle("Get Verified");

    const usernameInput = new TextInputBuilder()
      .setCustomId("redditUsername")
      .setLabel("Reddit Username")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const linkInput = new TextInputBuilder()
      .setCustomId("redditLink")
      .setLabel("Reddit Profile Link")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const cqsLinkInput = new TextInputBuilder()
      .setCustomId("cqspostlink")
      .setLabel("CQS score Post Link")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(
      new ActionRowBuilder().addComponents(usernameInput),
      new ActionRowBuilder().addComponents(linkInput),
      new ActionRowBuilder().addComponents(cqsLinkInput),
    );

    await interaction.showModal(modal);
  },
};
