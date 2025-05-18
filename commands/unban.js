const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Desbanea a un usuario del servidor')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('ID del usuario que quieres desbanear')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Razón del desbaneo')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('razon') || 'No se proporcionó una razón';

        try {
            // Comprobar si el ID es válido
            if (!/^\d+$/.test(userId)) {
                return interaction.reply({
                    content: 'Por favor, proporciona un ID de usuario válido.',
                    ephemeral: true
                });
            }

            await interaction.guild.members.unban(userId, reason);
            await interaction.reply(`El usuario con ID ${userId} ha sido desbaneado. Razón: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Hubo un error al intentar desbanear al usuario. Asegúrate de que el ID es correcto y que el usuario está baneado.',
                ephemeral: true
            });
        }
    }
};