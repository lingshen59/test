const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Establece tu estado como AFK')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Razón por la que estás AFK')
                .setRequired(false)),

    async execute(interaction) {
        const reason = interaction.options.getString('reason') || 'AFK';
        await interaction.reply(`${interaction.user.tag} ahora está AFK: ${reason}`);
        // Aquí puedes agregar lógica adicional como almacenar el estado AFK en una base de datos
    }
};