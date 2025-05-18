const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Remueve el timeout a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario al que quitar el timeout')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Razón para quitar el timeout')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('razon') || 'No se proporcionó una razón';

        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({
                content: 'No se pudo encontrar a ese usuario en el servidor.',
                ephemeral: true
            });
        }

        if (!member.isCommunicationDisabled()) {
            return interaction.reply({
                content: 'Este usuario no tiene un timeout activo.',
                ephemeral: true
            });
        }

        try {
            await member.timeout(null, reason);
            await interaction.reply(`Se ha removido el timeout a ${user.tag}. Razón: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Hubo un error al intentar remover el timeout al usuario.',
                ephemeral: true
            });
        }
    }
};