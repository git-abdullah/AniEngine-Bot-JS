const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),

	async execute(inter) {
		await inter.deferReply();
		await inter.editReply('Pong!');
		console.log('[LOG]\tPinged back!');
		return;
	},
};