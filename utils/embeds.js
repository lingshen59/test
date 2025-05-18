const { EmbedBuilder } = require('discord.js');

/**
 * Crea un embed de éxito
 * @param {string} title - Título del embed
 * @param {string} description - Descripción del embed
 * @returns {EmbedBuilder} - El embed creado
 */
function success(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor('#00FF00')
    .setTimestamp();
}

/**
 * Crea un embed de error
 * @param {string} title - Título del embed
 * @param {string} description - Descripción del embed
 * @returns {EmbedBuilder} - El embed creado
 */
function error(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor('#FF0000')
    .setTimestamp();
}

/**
 * Crea un embed de información
 * @param {string} title - Título del embed
 * @param {string} description - Descripción del embed
 * @returns {EmbedBuilder} - El embed creado
 */
function info(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor('#3498DB')
    .setTimestamp();
}

/**
 * Crea un embed de advertencia
 * @param {string} title - Título del embed
 * @param {string} description - Descripción del embed
 * @returns {EmbedBuilder} - El embed creado
 */
function warning(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor('#FFA500')
    .setTimestamp();
}

module.exports = {
  success,
  error,
  info,
  warning
};