const { SlashCommandBuilder } = require("discord.js");
const { backupOne } = require("../backup");
const { collections } = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("backup")
    .setDescription("Backup data.")
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
      await inte.followUp(`backing up ${_collectionName}...`);
      if (!inte.inGuild()) inte.channel.sendTyping();
      await backupOne(_collectionName).then(async (success) => {
        if (success) {
          await inte.followUp(`${_collectionName} has been backed up!`);
        } else {
          await inte.followUp(`couldn't backup ${_collectionName}.`);
        }
      });
    }

    let collectionName = interaction.options.getString("collection_name");

    if (collectionName != "all") {
      await runBackup(collectionName, interaction);
    } else {
      for (const collection of collections) {
        await runBackup(collection, interaction);
      }
      await interaction.followUp("Backup process completed!");
    }

    return;
  },
};
