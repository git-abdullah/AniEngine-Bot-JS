import { SlashCommandBuilder } from 'discord.js';

const pingCommand = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('replies back with pong!')
	
export default pingCommand.toJSON();