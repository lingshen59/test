const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('webhookinfo')
        .setDescription('Muestra información sobre un webhook por su ID')
        .addStringOption(option =>
            option.setName('webhookid')
                .setDescription('ID del webhook')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks),

    async execute(interaction) {
        const webhookId = interaction.options.getString('webhookid');

        try {
            const webhooks = await interaction.guild.fetchWebhooks();
            const webhook = webhooks.find(wh => wh.id === webhookId);

            if (!webhook) {
                return interaction.reply({
                    content: 'No se encontró ningún webhook con ese ID en este servidor.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(`Información del Webhook: ${webhook.name}`)
                .setThumbnail(webhook.avatarURL() || interaction.client.user.displayAvatarURL())
                .setColor('Blue')
                .addFields(
                    { name: 'ID', value: webhook.id, inline: true },
                    { name: 'Tipo', value: webhook.type, inline: true },
                    { name: 'Canal', value: `<#${webhook.channelId}>`, inline: true },
                    { name: 'Creado por', value: webhook.owner ? `<@${webhook.owner.id}>` : 'Desconocido', inline: true },
                    { name: 'Fecha de creación', value: `<t:${Math.floor(webhook.createdTimestamp / 1000)}:F>`, inline: false },
                    { name: 'URL', value: '```' + webhook.url + '```', inline: false }
                )
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true // Enviamos como efímero por seguridad, para no exponer la URL públicamente
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Hubo un error al intentar obtener información del webhook.',
                ephemeral: true
            });
        }
    }
};