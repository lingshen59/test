# Bot de Discord Mejorado

Un bot de Discord potente con múltiples comandos de moderación y utilidades.

## Características

- **Comandos de Moderación**: ban, kick, mute, timeout, unban, unmute, clear
- **Comandos de Utilidad**: ping, afk, avatar, serverinfo, userinfo
- **Funcionalidades Web**: web-screenshot
- **Gestión de Webhooks**: webhookdelete, webhookinfo, webhookspam

## Instalación

1. Clona este repositorio
2. Instala las dependencias con `npm install`
3. Crea un archivo `.env` con tu token de bot de Discord
4. Ejecuta el bot con `npm start`

## Comandos

### Moderación

- `/ban` - Banea a un usuario del servidor
- `/kick` - Expulsa a un usuario del servidor
- `/mute` - Silencia a un usuario
- `/timeout` - Aplica un timeout a un usuario
- `/unban` - Desbanea a un usuario
- `/unmute` - Quita el silencio a un usuario
- `/clear` - Elimina mensajes del canal

### Utilidad

- `/ping` - Muestra la latencia del bot
- `/afk` - Establece tu estado como AFK
- `/avatar` - Muestra el avatar de un usuario
- `/serverinfo` - Muestra información del servidor
- `/userinfo` - Muestra información de un usuario

### Web

- `/web-screenshot` - Toma una captura de pantalla de una página web

### Webhooks

- `/webhookdelete` - Elimina un webhook por su ID
- `/webhookinfo` - Muestra información sobre un webhook
- `/webhookspam` - Envía múltiples mensajes a través de un webhook

## Licencia

MIT