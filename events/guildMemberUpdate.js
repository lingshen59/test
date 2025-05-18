// events/guildMemberUpdate.js
const { Events } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    name: Events.GuildMemberUpdate,
    once: false,
    async execute(oldMember, newMember) {
        try {
            // Verificar si es un boost
            if (!oldMember.premiumSince && newMember.premiumSince) {
                const configPath = './config.json';
                let config = {};
                
                try {
                    const configData = fs.readFileSync(configPath, 'utf8');
                    config = JSON.parse(configData);
                } catch (err) {
                    return;
                }
                
                const guildId = newMember.guild.id;
                const guildConfig = config.guilds?.[guildId];
                
                if (!guildConfig) return;
                
                // Manejo de boosts
                if (guildConfig.boost && guildConfig.boostChannel) {
                    const channel = newMember.guild.channels.cache.get(guildConfig.boostChannel);
                    if (channel) {
                        let message = guildConfig.boostMessage || '¡Gracias {usuario} por impulsar el servidor!';
                        message = message.replace('{usuario}', `<@${newMember.id}>`);
                        channel.send(message);
                    }
                }
                
                // Logs de boost
                if (guildConfig.logs && guildConfig.logsChannel) {
                    const logChannel = newMember.guild.channels.cache.get(guildConfig.logsChannel);
                    if (logChannel) {
                        logChannel.send(`**Nuevo boost:** <@${newMember.id}> ha impulsado el servidor!`);
                    }
                }
            }
        } catch (error) {
            console.error('Error en evento guildMemberUpdate:', error);
        }
    },
};