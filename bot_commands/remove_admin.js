const { SlashCommandBuilder } = require("discord.js");
const Helper = require("../helper");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove_admin")
    .setDescription("remove another discord user as admin.")
    .addUserOption((option) => {
      option
        .setName("user")
        .setDescription("mention the user you want to remove as admin. ")
        .setRequired(true);

      return option;
    }),

  async execute(interaction) {
    const superAdminId = process.env.SUPER_ADMIN_ID;

    let user = interaction.options.getUser("user");

    if (interaction.user.id !== superAdminId) {
      await interaction.followUp(
        "Sorry this command requires superadmin privileges."
      );
      return;
    }

    if (await Helper.isAdmin(user.id)) {
      await fetch("https://annie-api.azurewebsites.net/delete-admin?", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discordId: user.id }),
      })
        .then(async (response) => await response.json())
        .then(async (success) => {
          if (success) {
            await interaction.followUp(
              `<@${user.id}>'s admin priveleges has been revoked.`
            );
          } else {
            await interaction.followUp("Something went wrong.");
          }
        });
    } else {
      await interaction.followUp(
        `<@${user.id}> has no admin privileges, nothing to do here.`
      );
    }

    return;
  },
};
