const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('webhookspam')
        .setDescription('Envía múltiples mensajes a través de un webhook (usar con precaución)')
        .addStringOption(option =>
            option.setName('webhookurl')
                .setDescription('URL del webhook')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('Mensaje a enviar')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('Cantidad de mensajes a enviar (máximo 10)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const webhookUrl = interaction.options.getString('webhookurl');
        const message = interaction.options.getString('mensaje');
        let amount = interaction.options.getInteger('cantidad');

        // Limitar la cantidad para evitar abusos
        if (amount > 10) amount = 10;
        if (amount < 1) amount = 1;

        // Validar la URL del webhook
        if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
            return interaction.editReply('Por favor, proporciona una URL de webhook válida.');
        }

        try {
            // Extraer ID y token del webhook desde la URL
            const parts = webhookUrl.split('/');
            const webhookId = parts[5];
            const webhookToken = parts[6];

            const webhook = await interaction.client.fetchWebhook(webhookId, webhookToken);

            // Enviar los mensajes
            for (let i = 0; i < amount; i++) {
                await webhook.send({
                    content: message,
                    username: interaction.client.user.username,
                    avatarURL: interaction.client.user.displayAvatarURL()
                });

                // Pequeña pausa para evitar rate limits
                if (i < amount - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            await interaction.editReply(`Se han enviado ${amount} mensajes al webhook correctamente.`);

        } catch (error) {
            console.error(error);
            await interaction.editReply('Hubo un error al intentar enviar los mensajes. Verifica que la URL del webhook sea correcta y que el webhook exista.');
        }
    }
};