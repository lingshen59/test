const { Client, GatewayIntentBits, Collection, Events, REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences
    ]
});

// Colección para comandos slash
client.commands = new Collection();
const commands = [];

// Cargar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.log(`[ADVERTENCIA] El comando en ${filePath} no tiene las propiedades "data" o "execute" requeridas.`);
    }
}

// Cargar eventos
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

// Evento ready
client.once(Events.ClientReady, () => {
    console.log(`Conectado como ${client.user.tag}`);

    // Registrar comandos slash
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    (async () => {
        try {
            console.log('Comenzando a actualizar comandos de aplicación (/).');

            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            );

            console.log('Comandos de aplicación (/) actualizados correctamente.');
        } catch (error) {
            console.error(error);
        }
    })();
});

// Manejar interacciones de comandos slash
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const errorMessage = { content: 'Hubo un error al ejecutar este comando.', ephemeral: true };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// Comando: web-screenshot
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!screenshot')) {
        const args = message.content.slice('!screenshot'.length).trim().split(/ +/);
        const url = args[0];

        if (!url) {
            return message.reply('Por favor, proporciona una URL para capturar.');
        }

        try {
            await message.channel.sendTyping();

            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: 'new'
            });

            const page = await browser.newPage();
            await page.goto(url);
            const screenshot = await page.screenshot();
            await browser.close();

            await message.reply({
                content: `Captura de pantalla de ${url}:`,
                files: [{ attachment: screenshot, name: 'screenshot.png' }]
            });
        } catch (error) {
            console.error(error);
            await message.reply('Hubo un error al capturar la pantalla.');
        }
    }
});

// Iniciar sesión
client.login(process.env.TOKEN);