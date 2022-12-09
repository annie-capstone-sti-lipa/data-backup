const {
  Client,
  Partials,
  Events,
  Collection,
  REST,
  Routes,
} = require("discord.js");

const Helper = require("./helper");
const fs = require("node:fs");
const path = require("node:path");

require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

const client = new Client({
  intents: [7796],
  partials: [Partials.Message, Partials.Channel],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "bot_commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  await interaction.deferReply();

  if (!(await Helper.isAdmin(interaction.user.id))) {
    await interaction.followUp({
      content: "Sorry you don't have permissions to perform that action.",
      ephemeral: true,
    });
    return;
  }

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.followUp({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

const commands = [];
for (const file of commandFiles) {
  const command = require(`./bot_commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();

client.login(token);
