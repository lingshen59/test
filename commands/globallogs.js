// commands/globallog.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('globallog')
        .setDescription('Configura el canal de logs global para el bot')
        .addChannelOption(option => 
            option.setName('canal')
                .setDescription('Canal para logs globales del bot')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        try {
            // Verificar si el usuario es el propietario del bot
            const ownerId = process.env.OWNER_ID || ''; // Puedes definir esto en tu .env
            if (interaction.user.id !== ownerId) {
                return interaction.reply({ content: 'Solo el propietario del bot puede usar este comando', ephemeral: true });
            }
            
            let config = {};
            const configPath = './config.json';
            
            try {
                const configData = fs.readFileSync(configPath, 'utf8');
                config = JSON.parse(configData);
            } catch (err) {
                config = { guilds: {} };
            }
            
            const channel = interaction.options.getChannel('canal');
            
            config.globalLogChannel = channel.id;
            
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            
            await interaction.reply(`Canal de logs global configurado en ${channel}`);
        } catch (error) {
            console.error('Error en el comando de globallog:', error);
            await interaction.reply({ content: 'Hubo un error al configurar el canal de logs global', ephemeral: true });
        }
    },
};