const commands = {
  getverified: require("../commands/getVerified"),
  verified: require("../commands/verified"),
  createtask: require("../commands/createTask"),
  submit: require("../commands/submit"),
  markcompleted: require("../commands/markCompleted"),
  ping: require("../commands/ping"),
};

module.exports = async (interaction) => {
  const cmd = commands[interaction.commandName];
  if (!cmd) return;

  await cmd.execute(interaction);
};
