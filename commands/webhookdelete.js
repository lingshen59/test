const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('webhookdelete')
        .setDescription('Elimina un webhook por su ID o URL')
        .addStringOption(option =>
            option.setName('webhook')
                .setDescription('ID o URL del webhook a eliminar')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks),

    async execute(interaction) {
        const webhookInput = interaction.options.getString('webhook');

        // Determinar si es una URL o un ID
        let webhookId;
        let webhookToken;

        if (webhookInput.startsWith('https://discord.com/api/webhooks/')) {
            // Es una URL
            const parts = webhookInput.split('/');
            webhookId = parts[5];
            webhookToken = parts[6];
        } else {
            // Asumimos que es un ID
            webhookId = webhookInput;
        }

        try {
            if (webhookToken) {
                // Si tenemos el token, podemos eliminar el webhook directamente
                const webhook = await interaction.client.fetchWebhook(webhookId, webhookToken);
                await webhook.delete(`Solicitado por ${interaction.user.tag}`);
            } else {
                // Si solo tenemos el ID, necesitamos buscar el webhook en el servidor
                const webhooks = await interaction.guild.fetchWebhooks();
                const webhook = webhooks.find(wh => wh.id === webhookId);

                if (!webhook) {
                    return interaction.reply({
                        content: 'No se encontró ningún webhook con ese ID en este servidor.',
                        ephemeral: true
                    });
                }

                await webhook.delete(`Solicitado por ${interaction.user.tag}`);
            }

            await interaction.reply({
                content: 'El webhook ha sido eliminado exitosamente.',
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Hubo un error al intentar eliminar el webhook. Asegúrate de que el ID/URL es correcto y que tengo permisos para eliminarlo.',
                ephemeral: true
            });
        }
    }
};