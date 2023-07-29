// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);

client.commands = new Collection();

// helps to construct a path to the 'commands' directory
// const commandsPath = path.join(__dirname, 'commands');
const foldersPath = path.join(__dirname, 'commands');
// reads the path to the directory and returns an array of all the files names it contains
// const commandFiles = fs
//   .readdirSync(commandsPath)
//   // removes any non-JavaScript files from the array
//   .filter((file) => file.endsWith('.js'));
const commandFolders = fs.readdirSync(foldersPath);

// loop over the array and dynamically set each command into the 'client.commands' Collection
for (const folder of commandFolders) {
  // helps to construct a path to the 'commands' directory
  const commandsPath = path.join(foldersPath, folder);
  // reads the path to the directory and returns an array of all the files names it contains
  const commandFiles = fs
    .readdirSync(commandsPath)
    // removes any non-JavaScript files from the array
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// execute code when your application receives an interaction.
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
});
