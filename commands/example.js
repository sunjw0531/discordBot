const { SlashCommandBuilder } = require('discord.js');

module.export = {
  data: new SlashCommandBuilder()
    .setName('엄준식')
    .setDescription('엄준식은 살아있다.'),
  async execute(interaction) {
    await interaction.reply('엄준식은 살아있다!!');
  },
};
