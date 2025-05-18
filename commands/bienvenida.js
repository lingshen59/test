// commands/bienvenida.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bienvenida')
        .setDescription('Configura el sistema de bienvenidas')
        .addSubcommand(subcommand =>
            subcommand
                .setName('activar')
                .setDescription('Activa el sistema de bienvenidas')
                .addChannelOption(option => 
                    option.setName('canal')
                        .setDescription('Canal para mensajes de bienvenida')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('mensaje')
                        .setDescription('Mensaje de bienvenida (usa {usuario} para mencionar)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('desactivar')
                .setDescription('Desactiva el sistema de bienvenidas')),
    
    async execute(interaction) {
        try {
            let config = {};
            const configPath = './config.json';
            
            // Intentar cargar la configuración existente
            try {
                const configData = fs.readFileSync(configPath, 'utf8');
                config = JSON.parse(configData);
            } catch (err) {
                // Si el archivo no existe, creamos una estructura básica
                config = { guilds: {} };
            }
            
            const guildId = interaction.guild.id;
            
            if (!config.guilds) config.guilds = {};
            if (!config.guilds[guildId]) config.guilds[guildId] = {};
            
            const subcommand = interaction.options.getSubcommand();
            
            if (subcommand === 'activar') {
                const channel = interaction.options.getChannel('canal');
                const message = interaction.options.getString('mensaje');
                
                config.guilds[guildId].welcome = true;
                config.guilds[guildId].welcomeChannel = channel.id;
                config.guilds[guildId].welcomeMessage = message;
                
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                
                await interaction.reply(`Sistema de bienvenidas activado en el canal ${channel}`);
            } else if (subcommand === 'desactivar') {
                config.guilds[guildId].welcome = false;
                
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                
                await interaction.reply('Sistema de bienvenidas desactivado');
            }
        } catch (error) {
            console.error('Error en el comando de bienvenida:', error);
            await interaction.reply({ content: 'Hubo un error al configurar las bienvenidas', ephemeral: true });
        }
    },
};