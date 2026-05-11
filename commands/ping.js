const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  async execute(interaction) {
    // 1. Immediately defer (buys you time and handles the 3-second limit)
    const startTime = Date.now();
    await interaction.deferReply();

    // ✅ 1. ADMIN CHECK
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.editReply({
        content:
          "❌ Only admins can use this command. And you are not that guy bro 😡",
      });
    }

    // ✅ 2. CHANNEL RESTRICTION
    if (interaction.channel.id !== process.env.ADMIN_CHANNEL_ID) {
      return interaction.editReply({
        content: "❌ Use this command only in admin commands channel",
      });
    }

    try {
      // 2. Measure Database Latency
      const dbStart = Date.now();
      await mongoose.connection.db.admin().ping();
      const dbLatency = Date.now() - dbStart;

      // 3. Calculate Latencies
      // Roundtrip is the time between command start and now
      const roundtripLatency = Date.now() - startTime;
      const wsPing = interaction.client.ws.ping;

      const pingEmbed = new EmbedBuilder()
        .setTitle("🏓 Pong!")
        .setColor(dbLatency > 500 ? "#ff0000" : "#00ff00")
        .addFields(
          {
            name: "🤖 Bot Latency",
            value: `\`${roundtripLatency}ms\``,
            inline: true,
          },
          { name: "🌐 API Latency", value: `\`${wsPing}ms\``, inline: true },
          { name: "💾 Database", value: `\`${dbLatency}ms\``, inline: true },
        )
        .setTimestamp();

      // 4. Update the "thinking" message with the results
      await interaction.editReply({ content: null, embeds: [pingEmbed] });
    } catch (err) {
      console.error("Ping Command Error:", err);
      await interaction.editReply("❌ Failed to measure latency.");
    }
  },
};
