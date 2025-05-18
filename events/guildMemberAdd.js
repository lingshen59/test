// events/guildMemberAdd.js
const { Events } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member) {
        try {
            const configPath = './config.json';
            let config = {};
            
            try {
                const configData = fs.readFileSync(configPath, 'utf8');
                config = JSON.parse(configData);
            } catch (err) {
                return; // Si no hay configuración, no hacemos nada
            }
            
            const guildId = member.guild.id;
            const guildConfig = config.guilds?.[guildId];
            
            if (!guildConfig) return;
            
            // Manejo de bienvenidas
            if (guildConfig.welcome && guildConfig.welcomeChannel) {
                const channel = member.guild.channels.cache.get(guildConfig.welcomeChannel);
                if (channel) {
                    let message = guildConfig.welcomeMessage || '¡Bienvenido {usuario} al servidor!';
                    message = message.replace('{usuario}', `<@${member.id}>`);
                    channel.send(message);
                }
            }
            
            // Logs de entrada al servidor
            if (guildConfig.logs && guildConfig.logsChannel) {
                const logChannel = member.guild.channels.cache.get(guildConfig.logsChannel);
                if (logChannel) {
                    logChannel.send(`**Nuevo miembro:** ${member.user.tag} (ID: ${member.id})\n**Cuenta creada:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`);
                }
            }
        } catch (error) {
            console.error('Error en evento guildMemberAdd:', error);
        }
    },
};