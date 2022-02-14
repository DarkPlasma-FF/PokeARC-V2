module.exports = {
  name: 'spawns',
  run: async (client, message, args) => {
    if (args[0].toLowerCase() === 'small') {
      if (!message.guild)
        return message.channel.send(client.config.errors.guildOnlyCommand);

      client.commands.get('spawns-small').run(client, message, args);
    } else if (args[0].toLowerCase() === 'big') {
      if (!message.guild)
        return message.channel.send(client.config.errors.guildOnlyCommand);

      client.commands.get('spawns-big').run(client, message, args);
    } else return;
  },
};
