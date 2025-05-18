// events/guildCreate.js
const { Events } = require('discord.js');
const fs = require('node:fs');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildCreate,
    once: false,
    async execute(guild) {
        try {
            console.log(`Bot añadido a un nuevo servidor: ${guild.name} (ID: ${guild.id})`);
            
            const configPath = './config.json';
            let config = {};
            
            try {
                const configData = fs.readFileSync(configPath, 'utf8');
                config = JSON.parse(configData);
            } catch (err) {
                config = { guilds: {} };
            }
            
            if (!config.guilds) config.guilds = {};
            
            // Guardar información del servidor
            config.guilds[guild.id] = {
                ...(config.guilds[guild.id] || {}),
                name: guild.name,
                joinedAt: new Date().toISOString(),
                memberCount: guild.memberCount,
                owner: guild.ownerId
            };
            
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            
            // Si hay un canal de logs global configurado
            if (config.globalLogChannel) {
                const logChannel = guild.client.channels.cache.get(config.globalLogChannel);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setTitle('Nuevo servidor')
                        .setColor('#00FF00')
                        .setThumbnail(guild.iconURL({ dynamic: true }) || null)
                        .addFields(
                            { name: 'Nombre', value: guild.name, inline: true },
                            { name: 'ID', value: guild.id, inline: true },
                            { name: 'Miembros', value: `${guild.memberCount}`, inline: true },
                            { name: 'Propietario', value: `<@${guild.ownerId}>`, inline: true },
                            { name: 'Creado', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
                        )
                        .setTimestamp();
                    
                    logChannel.send({ embeds: [embed] });
                }
            }
        } catch (error) {
            console.error('Error en evento guildCreate:', error);
        }
    },
};