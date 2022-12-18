const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with user\'s tag!'),

	async execute(inter) {
		await inter.deferReply();
		await inter.editReply(`Trigger by: ${inter.user.tag} who joined at ${inter.member.joinedAt}`);
		console.log('[LOG]\tuser was called!');
		return;
	},
};