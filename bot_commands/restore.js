const { SlashCommandBuilder } = require("discord.js");
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
      await inte.followUp(`restoring ${_collectionName}.`);
      if (!inte.inGuild()) inte.channel.sendTyping();
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
      }
      await interaction.followUp("Restore process completed!");
    }

    return;
  },
};
