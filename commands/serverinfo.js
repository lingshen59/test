const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Muestra información sobre el servidor'),

    async execute(interaction) {
        const guild = interaction.guild;

        const embed = new EmbedBuilder()
            .setTitle(`Información de ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor('Blue')
            .addFields(
                { name: 'ID del servidor', value: guild.id, inline: true },
                { name: 'Fecha de creación', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
                { name: 'Propietario', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Miembros', value: `${guild.memberCount}`, inline: true },
                { name: 'Canales', value: `${guild.channels.cache.size}`, inline: true },
                { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: 'Emojis', value: `${guild.emojis.cache.size}`, inline: true },
                { name: 'Nivel de verificación', value: `${guild.verificationLevel}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};