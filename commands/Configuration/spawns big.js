const guild = require('../../models/guildConfig.js');

module.exports = {
  name: 'spawns-big',
  guildOnly: true,
  category: 'Configuration',
  description: `Configure the spawn images to be big.`,
  usage: `spawns big`,
  userPermissions: ['ADMINISTRATOR'],
  run: async (client, message, args) => {
    await guild.findOneAndDelete({ Id: message.guild.id });
    message.channel.send(
      `${client.emotes.tick} | Spawn images will now be big.`
    );
  },
};
