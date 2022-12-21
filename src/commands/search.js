import { SlashCommandBuilder } from 'discord.js';

const searchCommand = new SlashCommandBuilder()
	.setName('search')
	.setDescription('searches for anime matching your query.')
	.addStringOption(option =>
		option
			.setName('search_query')
			.setDescription('anime name that you want to search')
			.setRequired(true))

	
export default searchCommand.toJSON();