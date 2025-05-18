const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Silencia a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario que quieres silenciar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Razón del silenciamiento')
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

        try {
            // Buscar un rol de mute o crearlo si no existe
            let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

            if (!muteRole) {
                muteRole = await interaction.guild.roles.create({
                    name: 'Muted',
                    permissions: []
                });

                // Configurar permisos en todos los canales
                interaction.guild.channels.cache.forEach(async channel => {
                    await channel.permissionOverwrites.create(muteRole, {
                        SendMessages: false,
                        AddReactions: false,
                        Connect: false
                    });
                });
            }

            await member.roles.add(muteRole);
            await interaction.reply(`${user.tag} ha sido silenciado. Razón: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Hubo un error al intentar silenciar al usuario.',
                ephemeral: true
            });
        }
    }
};