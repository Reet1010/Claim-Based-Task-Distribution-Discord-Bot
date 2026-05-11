const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const mongoose = require("mongoose");
const ClaimTask = require("../models/ClaimTask");

function getCollection(name) {
  return name.replace(/[^a-zA-Z0-9]/g, "_");
}

function getDynamicModel(collectionName) {
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName];
  }

  const schema = new mongoose.Schema(
    {
      taskId: Number,
      price: String,
      postUrl: String,
      range: String,
      slots: Number,
    },
    { versionKey: false },
  );

  return mongoose.model(collectionName, schema, collectionName);
}

exports.createAndPostTask = async (interaction, data) => {
  const adminName = interaction.member.displayName;
  const collectionName = getCollection(adminName);

  const { task, price, link, range, slots, comments, subReddit } = data;

  const taskNumber = Number(task.replace(/[^0-9]/g, ""));

  const DynamicModel = getDynamicModel(collectionName);

  const exists = await ClaimTask.findOne({
    taskId: task,
    adminName,
  });

  if (exists) {
    throw new Error("❌ Task already exists");
  }

  await DynamicModel.create({
    taskId: taskNumber,
    price,
    postUrl: link,
    range,
    slots,
  });

  const parsedComments =
    comments?.match(/\((.*?)\)/g)?.map((c) => c.replace(/[()]/g, "")) || [];

  const newTask = await ClaimTask.create({
    taskId: task,
    adminName,
    price,
    postLink: link,
    range,
    slots,
    comments: parsedComments,
    claimedBy: [],
  });

  const claimChannel = await interaction.client.channels.fetch(
    process.env.CLAIM_CHANNEL_ID,
  );

  const button = new ButtonBuilder()
    .setCustomId(`claim_${task}`)
    .setLabel("Claim Task")
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder().addComponents(button);

  const msg = await claimChannel.send({
    content: `📌 Task: ${task}
👨‍💼 Admin: ${adminName}
🏢 Subreddit: ${subReddit || "safe"}
💰 Price: ${price}
🎯 Range: ${range}
👥 Slots: ${slots}`,
    components: [row],
  });

  newTask.messageId = msg.id;
  newTask.channelId = msg.channel.id;

  await newTask.save();
};
