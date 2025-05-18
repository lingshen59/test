const { SlashCommandBuilder } = require('discord.js');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('web-screenshot')
        .setDescription('Toma una captura de pantalla de una página web')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL de la página web')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const url = interaction.options.getString('url');

        // Validar URL
        let validUrl;
        try {
            validUrl = new URL(url);
        } catch (e) {
            return interaction.editReply('Por favor, proporciona una URL válida (incluyendo http:// o https://).');
        }

        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.goto(validUrl.href, { waitUntil: 'networkidle2' });

            // Crear directorio temporal si no existe
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }

            const screenshotPath = path.join(tempDir, `screenshot-${Date.now()}.png`);
            await page.screenshot({ path: screenshotPath, fullPage: false });
            await browser.close();

            await interaction.editReply({
                content: `Captura de pantalla de ${validUrl.href}:`,
                files: [screenshotPath]
            });

            // Eliminar el archivo después de enviarlo
            setTimeout(() => {
                fs.unlinkSync(screenshotPath);
            }, 5000);

        } catch (error) {
            console.error(error);
            await interaction.editReply('Hubo un error al intentar tomar la captura de pantalla.');
        }
    }
};