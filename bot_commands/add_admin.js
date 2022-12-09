const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add_admin")
    .setDescription("add another discord user as admin.")
    .addUserOption((option) => {
      option
        .setName("user")
        .setDescription("mention the user you want to add as admin. ")
        .setRequired(true);

      return option;
    }),

  async execute(interaction) {
    await interaction.deferReply();

    let user = interaction.options.getUser("user");

    await fetch("https://annie-api.azurewebsites.net/add-sudoer?", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discordId: user.id }),
    })
      .then(async (response) => await response.json())
      .then(async (success) => {
        if (success) {
          await interaction.followUp(
            `<@${user.id}> has been given admin privileges.`
          );
        } else {
          await interaction.followUp("Something went wrong.");
        }
      });
    return;
  },
};
