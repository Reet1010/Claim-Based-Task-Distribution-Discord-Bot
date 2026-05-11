const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

app.listen(port, () => {
  console.log(`Keep-alive server is running on port ${port}`);
});

require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");

const handleCommand = require("./handlers/commandHandler");
const handleButton = require("./handlers/buttonHandler");
const handleModal = require("./handlers/modalHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
});

// ---------------- DB ----------------
mongoose
  .connect(process.env.MONGO_URI, {
    maxPoolSize: 20,
  })
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => {
    console.log("DB Error:", err.message);
    process.exit(1);
  });

// ---------------- READY ----------------
client.once("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ---------------- INTERACTIONS ----------------
client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      await handleCommand(interaction);
    } else if (interaction.isButton()) {
      await handleButton(interaction, client);
    } else if (interaction.isModalSubmit()) {
      await handleModal(interaction, client);
    }
  } catch (err) {
    console.log("Interaction Error:", err.message);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "❌ Something went wrong",
        flags: 64,
      });
    }
  }
});

// ---------------- GLOBAL ERROR ----------------
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);
client.on("error", console.error);

// ---------------- LOGIN ----------------
client.login(process.env.TOKEN);
