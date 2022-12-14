const { SlashCommandBuilder } = require("discord.js");
const Helper = require("../helper");

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
    let user = interaction.options.getUser("user");

    if (await Helper.isAdmin(user.id)) {
      await interaction.followUp(`<@${user.id}> already has admin privileges.`);
    } else {
      await fetch("https://annie-api.azurewebsites.net/add-admin?", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discordId: user.id }),
      })
        .then(async (response) => await response.json())
        .then(async (success) => {
          if (success.success) {
            await interaction.followUp(
              `<@${user.id}> has been given admin privileges.`
            );
          } else {
            await interaction.followUp("Something went wrong.");
          }
        });
    }
    return;
  },
};
