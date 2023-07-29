const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('배팅').setDescription('배팅 커맨드'),
  async execute(interaction) {
    const data = '옥상으로 따라와';
    await interaction.reply(`너가 그렇게 싸움을 잘해? ${data}`);
  },
};
