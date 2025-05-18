const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Elimina un número específico de mensajes')
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('Número de mensajes a eliminar (1-100)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('cantidad');

        if (amount < 1 || amount > 100) {
            return interaction.reply({
                content: 'Debes especificar un número entre 1 y 100.',
                ephemeral: true
            });
        }

        try {
            await interaction.channel.bulkDelete(amount);
            await interaction.reply({
                content: `Se han eliminado ${amount} mensajes.`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Hubo un error al intentar eliminar los mensajes.',
                ephemeral: true
            });
        }
    }
};