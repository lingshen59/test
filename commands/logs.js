// commands/logs.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Configura el sistema de logs para el bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('activar')
                .setDescription('Activa el sistema de logs')
                .addChannelOption(option => 
                    option.setName('canal')
                        .setDescription('Canal para los logs')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('desactivar')
                .setDescription('Desactiva el sistema de logs')),
    
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
                
                config.guilds[guildId].logs = true;
                config.guilds[guildId].logsChannel = channel.id;
                
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                
                await interaction.reply(`Sistema de logs activado en el canal ${channel}`);
            } else if (subcommand === 'desactivar') {
                config.guilds[guildId].logs = false;
                
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                
                await interaction.reply('Sistema de logs desactivado');
            }
        } catch (error) {
            console.error('Error en el comando de logs:', error);
            await interaction.reply({ content: 'Hubo un error al configurar los logs', ephemeral: true });
        }
    },
};