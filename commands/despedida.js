// commands/despedida.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('despedida')
        .setDescription('Configura el sistema de despedidas')
        .addSubcommand(subcommand =>
            subcommand
                .setName('activar')
                .setDescription('Activa el sistema de despedidas')
                .addChannelOption(option => 
                    option.setName('canal')
                        .setDescription('Canal para mensajes de despedida')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('mensaje')
                        .setDescription('Mensaje de despedida (usa {usuario} para el nombre)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('desactivar')
                .setDescription('Desactiva el sistema de despedidas')),
    
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
                
                config.guilds[guildId].farewell = true;
                config.guilds[guildId].farewellChannel = channel.id;
                config.guilds[guildId].farewellMessage = message;
                
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                
                await interaction.reply(`Sistema de despedidas activado en el canal ${channel}`);
            } else if (subcommand === 'desactivar') {
                config.guilds[guildId].farewell = false;
                
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                
                await interaction.reply('Sistema de despedidas desactivado');
            }
        } catch (error) {
            console.error('Error en el comando de despedida:', error);
            await interaction.reply({ content: 'Hubo un error al configurar las despedidas', ephemeral: true });
        }
    },
};