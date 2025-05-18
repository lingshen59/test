// events/guildMemberRemove.js
const { Events } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,
    async execute(member) {
        try {
            const configPath = './config.json';
            let config = {};
            
            try {
                const configData = fs.readFileSync(configPath, 'utf8');
                config = JSON.parse(configData);
            } catch (err) {
                return;
            }
            
            const guildId = member.guild.id;
            const guildConfig = config.guilds?.[guildId];
            
            if (!guildConfig) return;
            
            // Manejo de despedidas
            if (guildConfig.farewell && guildConfig.farewellChannel) {
                const channel = member.guild.channels.cache.get(guildConfig.farewellChannel);
                if (channel) {
                    let message = guildConfig.farewellMessage || '¡Adiós {usuario}!';
                    message = message.replace('{usuario}', `${member.user.tag}`);
                    channel.send(message);
                }
            }
            
            // Logs de salida del servidor
            if (guildConfig.logs && guildConfig.logsChannel) {
                const logChannel = member.guild.channels.cache.get(guildConfig.logsChannel);
                if (logChannel) {
                    logChannel.send(`**Miembro salió:** ${member.user.tag} (ID: ${member.id})\n**Se unió:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`);
                }
            }
        } catch (error) {
            console.error('Error en evento guildMemberRemove:', error);
        }
    },
};