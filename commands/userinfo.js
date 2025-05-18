const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Muestra información sobre un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario del que quieres ver la información')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const embed = new EmbedBuilder()
            .setTitle(`Información de ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor('Random')
            .addFields(
                { name: 'ID', value: user.id, inline: true },
                { name: 'Apodo', value: member.nickname || 'Ninguno', inline: true },
                { name: 'Cuenta creada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false },
                { name: 'Se unió al servidor', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
                {
                    name: 'Roles', value: member.roles.cache.size > 1 ?
                        member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => `<@&${r.id}>`).join(', ') :
                        'Ninguno', inline: false
                }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};