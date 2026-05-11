const { addUserToRange } = require("../services/karmaService");

module.exports = {
  name: "verified",

  async execute(interaction) {
    // ✅ 1. ADMIN CHECK
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({
        content:
          "❌ Only admins can use this command. And you are not that guy bro 😡",
        flags: 64,
      });
    }

    // ✅ 2. CHANNEL RESTRICTION
    if (interaction.channel.id !== process.env.VERIFICATION_CHANNEL_ID) {
      return interaction.reply({
        content: "❌ Use this command only in verification channel",
        flags: 64,
      });
    }

    try {
      const user = interaction.options.getUser("user");
      const redditLink = interaction.options.getString("link");
      const range = interaction.options.getString("range");
      const admin = interaction.member.displayName;

      if (!user || !redditLink || !range) {
        return interaction.reply({
          content: "❌ Missing arguments",
          flags: 64,
        });
      }

      const member = await interaction.guild.members.fetch(user.id);

      await addUserToRange(member, redditLink, range, admin);

      await interaction.reply(
        `✅ ${member.displayName} added to Range ${range} by ${admin}`,
      );
    } catch (err) {
      await interaction.reply({
        content: "❌ Error in verified command",
        flags: 64,
      });
    }
  },
};
