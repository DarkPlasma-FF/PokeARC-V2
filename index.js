const fs = require('fs');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ['CHANNEL'],
});
const keepAlive = require('./server.js');
client.config = require('./config');
client.emotes = client.config.emojis;
client.color = client.config.colors;
client.slash = new Discord.Collection();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const commandFolders = fs
  .readdirSync('./commands')
  .filter((folder) => !folder.endsWith('.js'));

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    console.log(`[ Command ] Loaded ${command.name}`);
    client.commands.set(command.name, command);
    if (command.aliases)
      command.aliases.forEach((alias) =>
        client.aliases.set(alias, command.name)
      );
  }
}
const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const cmds = [];
const clientId = '938368950620786709';
const guildId = '924680013196955708';
const slashFolders = fs
  .readdirSync('./slash')
  .filter((folder) => !folder.endsWith('.js'));
for (const folder of slashFolders) {
  const slashFiles = fs
    .readdirSync(`./slash/${folder}`)
    .filter((file) => file.endsWith('.js'));
  for (const file of slashFiles) {
    const slashcmd = require(`./slash/${folder}/${file}`);
    cmds.push(slashcmd.data.toJSON());
    client.slash.set(slashcmd.data.name, slashcmd);
  }
}
const rest = new REST({ version: '9' }).setToken(process.env.Token);

(async () => {
  try {
    console.log('Registering slash commands.');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: cmds,
    });

    console.log('Registered slash commands.');
  } catch (error) {
    console.error(error);
  }
})();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection :');
  console.log(reason, p);
});
process.on('uncaughtException', (err, origin) => {
  console.log('Uncaught Exception :');
  console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('Uncaught Exception ( Monitor ) :');
  console.log(err, origin);
});
process.on('multipleResolves', (type, promise, reason) => {
  console.log('Multiple Resolves :');
  console.log(type, promise, reason);
});

keepAlive();
client.login(process.env.Token);
