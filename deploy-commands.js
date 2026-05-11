require("dotenv").config();

const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("getverified")
    .setDescription("Request verification"),

  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Checks the bot, API, and database latency"),

  new SlashCommandBuilder()
    .setName("verified")
    .setDescription("Verify user")
    .addUserOption((o) =>
      o.setName("user").setDescription("User").setRequired(true),
    )
    .addStringOption((o) =>
      o.setName("link").setDescription("Reddit link").setRequired(true),
    )
    .addStringOption((o) =>
      o.setName("range").setDescription("A/B/C").setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("createtask")
    .setDescription("Create task")
    .addStringOption((o) =>
      o.setName("taskid").setDescription("TASK ID").setRequired(true),
    )
    .addStringOption((o) =>
      o.setName("price").setDescription("Price").setRequired(true),
    )
    .addStringOption((o) =>
      o.setName("link").setDescription("Post Link").setRequired(true),
    )
    .addStringOption((o) =>
      o.setName("range").setDescription("Range: A/B/C").setRequired(true),
    )
    .addIntegerOption((o) =>
      o.setName("slots").setDescription("Number of slots").setRequired(true),
    )
    .addStringOption((o) =>
      o
        .setName("subreddit")
        .setDescription("Name of the subreddit related to the task"),
    )
    .addStringOption((o) =>
      o.setName("comments").setDescription("All the comments"),
    ),

  new SlashCommandBuilder().setName("submit").setDescription("Submit task"),

  new SlashCommandBuilder()
    .setName("markcompleted")
    .setDescription("Mark completed")
    .addStringOption((o) =>
      o.setName("taskid").setDescription("Enter the Task ID").setRequired(true),
    )
    .addStringOption((o) =>
      o
        .setName("post")
        .setDescription("URL of the post related to the task")
        .setRequired(true),
    )
    .addStringOption((o) =>
      o
        .setName("comment")
        .setDescription("Link of the comment made by the user")
        .setRequired(true),
    )
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("Username of the user")
        .setRequired(true),
    ),
].map((c) => c.toJSON());

const rest = new REST({
  version: "10",
}).setToken(process.env.TOKEN);

(async () => {
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
  });

  console.log("✅ Commands deployed");
})();
