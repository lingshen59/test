const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsa a un usuario del servidor')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario que quieres expulsar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Razón de la expulsión')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

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

        if (!member.kickable) {
            return interaction.reply({
                content: 'No tengo permisos para expulsar a ese usuario.',
                ephemeral: true
            });
        }

        try {
            await member.kick(reason);
            await interaction.reply(`${user.tag} ha sido expulsado. Razón: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Hubo un error al intentar expulsar al usuario.',
                ephemeral: true
            });
        }
    }
};