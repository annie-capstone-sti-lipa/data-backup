const { SlashCommandBuilder } = require("discord.js");
const { backupOne } = require("../backup");
const { collections } = require("../config");
const { restoreOne } = require("../restore");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restore")
    .setDescription("Restore data.")
    .addStringOption((option) => {
      option
        .setName("collection_name")
        .setDescription("the name of the collection to backup")
        .setRequired(true);

      collections.forEach((collection) => {
        option.addChoices({ name: collection, value: collection });
      });
      option.addChoices({ name: "all", value: "all" });
      return option;
    }),

  async execute(interaction) {
    async function runBackup(_collectionName, inte) {
      await restoreOne(_collectionName).then(async (response) => {
        await inte.followUp(response);
      });
    }

    await interaction.deferReply();

    let collectionName = interaction.options.getString("collection_name");

    if (collectionName != "all") {
      await runBackup(collectionName, interaction);
    } else {
      for (const collection of collections) {
        await runBackup(collection, interaction);
        interaction.channel.sendTyping();
      }
      await interaction.followUp("Restore process completed!");
    }

    return;
  },
};
