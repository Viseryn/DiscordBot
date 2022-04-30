/**
 * STORYWRITER DISCORD BOT
 * 
 * @version 1.0.0
 * @author Viseryn
 */



/**
 * Require necessary (discord.js-)classes and create new client instance
 */

const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


/**
 * Fetch commands
 */

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}


/**
 * Set online status 
 */

client.once('ready', () => {
    client.user.setStatus('online');
    client.user.setActivity('Süppé!', { type: 'WATCHING' });
    // client.user.setActivity('Wird gerade richtig durchgetestet!');
    console.log('Storywriter: Running.');
});


/**
 * Reply to commands
 */

client.on('interactionCreate', async interaction => {
    // Check whether interaction is a command
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // If the interaction is an actual command, try to execute.
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error.', ephemeral: true});
    }
});


/**
 * Login to Discord with client's token
 */

client.login(token);