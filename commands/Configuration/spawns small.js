const guild = require('../../models/guildConfig.js');

module.exports = {
  name: 'spawns-small',
  guildOnly: true,
  category: 'Configuration',
  description: `Configure the spawn images to be small.`,
  usage: `spawns small`,
  userPermissions: ['ADMINISTRATOR'],
  run: async (client, message, args) => {
    await guild.create({ Id: message.guild.id, spawnsBig: false });
    message.channel.send(
      `${client.emotes.tick} | Spawn images will now be small.`
    );
  },
};
