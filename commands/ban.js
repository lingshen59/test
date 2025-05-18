const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un usuario del servidor')
    .addUserOption(option => 
      option.setName('usuario')
        .setDescription('Usuario a banear')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('razón')
        .setDescription('Razón del baneo')
        .setRequired(false)),
  async execute(interaction) {
    // Verificar permisos
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: '❌ No tienes permisos para banear usuarios.', ephemeral: true });
    }
    
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razón') || 'No se proporcionó una razón';
    
    try {
      await interaction.guild.members.ban(user, { reason });
      
      const embed = new EmbedBuilder()
        .setTitle('Usuario Baneado')
        .setColor('#FF0000')
        .setDescription(`**Usuario:** ${user.tag}\n**ID:** ${user.id}\n**Razón:** ${reason}`)
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `❌ No pude banear a ${user.tag}: ${error.message}`, ephemeral: true });
    }
  },
};