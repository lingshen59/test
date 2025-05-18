const { PermissionsBitField } = require('discord.js');

/**
 * Verifica si un usuario tiene los permisos necesarios
 * @param {Interaction} interaction - La interacción de Discord
 * @param {PermissionResolvable} permissions - Los permisos a verificar
 * @param {Object} options - Opciones adicionales
 * @returns {boolean} - True si tiene permisos, false en caso contrario
 */
function checkPermissions(interaction, permissions, options = {}) {
  const { member, guild } = interaction;
  const { checkAdmin = true, checkOwner = true } = options;
  
  // Verificar si es el dueño del servidor
  if (checkOwner && guild.ownerId === member.id) {
    return true;
  }
  
  // Verificar si es administrador
  if (checkAdmin && member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return true;
  }
  
  // Verificar permisos específicos
  return member.permissions.has(permissions);
}

/**
 * Verifica si un usuario es el dueño del servidor
 * @param {Interaction} interaction - La interacción de Discord
 * @returns {boolean} - True si es el dueño, false en caso contrario
 */
function isOwner(interaction) {
  return interaction.guild.ownerId === interaction.member.id;
}

/**
 * Verifica si un usuario es administrador del servidor
 * @param {Interaction} interaction - La interacción de Discord
 * @returns {boolean} - True si es administrador, false en caso contrario
 */
function isAdmin(interaction) {
  return interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
}

module.exports = {
  checkPermissions,
  isOwner,
  isAdmin
};