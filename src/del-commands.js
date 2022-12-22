// Require the necessary discord.js classes
import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv'

// tokens and IDs
dotenv.config();
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// defining rest to del slash commands
const rest = new REST({ version: '10' }).setToken(token);

console.log('[WAIT] Deleting all the commands within given GUILD_ID')
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('[DONE] Successfully deleted all guild commands.'))
	.catch(() => console.log('[ERROR] Failed to delete all commands'));

	console.log('[WAIT] Deleting all global commands')

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
.then(() => console.log('[DONE] Successfully deleted all global commands.'))
.catch(() => console.log('[ERROR] Failed to delete all global commands'));