// commands/boost.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boost')
        .setDescription('Configura el sistema de agradecimiento por boosts')
        .addSubcommand(subcommand =>
            subcommand
                .setName('activar')
                .setDescription('Activa el sistema de boosts')
                .addChannelOption(option => 
                    option.setName('canal')
                        .setDescription('Canal para mensajes de boost')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('mensaje')
                        .setDescription('Mensaje de agradecimiento (usa {usuario} para mencionar)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('desactivar')
                .setDescription('Desactiva el sistema de boosts')),
    
    async execute(interaction) {
        try {
            let config = {};
            const configPath = './config.json';
            
            try {
                const configData = fs.readFileSync(configPath, 'utf8');
                config = JSON.parse(configData);
            } catch (err) {
                config = { guilds: {} };
            }
            
            const guildId = interaction.guild.id;
            
            if (!config.guilds) config.guilds = {};
            if (!config.guilds[guildId]) config.guilds[guildId] = {};
            
            const subcommand = interaction.options.getSubcommand();
            
            if (subcommand === 'activar') {
                const channel = interaction.options.getChannel('canal');
                const message = interaction.options.getString('mensaje');
                
                config.guilds[guildId].boost = true;
                config.guilds[guildId].boostChannel = channel.id;
                config.guilds[guildId].boostMessage = message;
                
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                
                await interaction.reply(`Sistema de boosts activado en el canal ${channel}`);
            } else if (subcommand === 'desactivar') {
                config.guilds[guildId].boost = false;
                
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                
                await interaction.reply('Sistema de boosts desactivado');
            }
        } catch (error) {
            console.error('Error en el comando de boost:', error);
            await interaction.reply({ content: 'Hubo un error al configurar los boosts', ephemeral: true });
        }
    },
};