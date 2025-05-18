const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Aplica un timeout a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario al que aplicar timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minutos')
                .setDescription('Duración del timeout en minutos (máximo 40320)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Razón del timeout')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const minutes = interaction.options.getInteger('minutos');
        const reason = interaction.options.getString('razon') || 'No se proporcionó una razón';

        // Verificar que los minutos sean válidos (máximo 28 días = 40320 minutos)
        if (minutes < 1 || minutes > 40320) {
            return interaction.reply({
                content: 'La duración debe estar entre 1 minuto y 28 días (40320 minutos).',
                ephemeral: true
            });
        }

        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({
                content: 'No se pudo encontrar a ese usuario en el servidor.',
                ephemeral: true
            });
        }

        if (!member.moderatable) {
            return interaction.reply({
                content: 'No tengo permisos para aplicar timeout a ese usuario.',
                ephemeral: true
            });
        }

        try {
            // Convertir minutos a milisegundos
            const duration = minutes * 60 * 1000;

            await member.timeout(duration, reason);
            await interaction.reply(`${user.tag} ha recibido un timeout de ${minutes} minutos. Razón: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Hubo un error al intentar aplicar el timeout.',
                ephemeral: true
            });
        }
    }
};