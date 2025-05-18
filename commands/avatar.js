const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Muestra el avatar de un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario del que quieres ver el avatar')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;

        const embed = new EmbedBuilder()
            .setTitle(`Avatar de ${user.tag}`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setColor('Random')
            .setFooter({ text: `Solicitado por ${interaction.user.tag}` });

        await interaction.reply({ embeds: [embed] });
    }
};