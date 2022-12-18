// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
		console.log(`[SUCCESS]\tcommand loaded /${command.data.name}`);
	}
	else {
		console.log(`[WARNING]\tThe command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`[READY]\tLogged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async inter => {
	if (!inter.isChatInputCommand()) {
		console.log('[WARNING]\tChat input command received, => ignored');
		return;
	}

	const command = inter.client.commands.get(inter.commandName);
	if (!command) {
		console.log(`[ERROR]\tCommand ${command} not found`);
		return;
	}
	try {
		await command.execute(inter);
		return;
	}
	catch (error) {
		console.log(error);
		await inter.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		return;
	}

});

// Log in to Discord with your client's token
client.login(token);