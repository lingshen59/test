const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde con la latencia del bot'),
  async execute(interaction) {
    await interaction.reply(`🏓 Pong! Latencia: ${interaction.client.ws.ping}ms`);
  },
};