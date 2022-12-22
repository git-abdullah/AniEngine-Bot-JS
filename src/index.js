// Require the necessary discord.js classes
import { 
	Client, 
	Events, 
	GatewayIntentBits, 
	EmbedBuilder, 
	REST, 
	Routes,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle
 } from 'discord.js';
import * as dotenv from 'dotenv'
import searchCommand from './commands/search.js';
import pingCommand from './commands/ping.js';


// tokens and IDs
dotenv.config();
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// url to graphql of anilist.co
const ANILIST_URL = 'https://graphql.anilist.co';

// qraphql queries to fetch data from api
const searchQuery = {
    query: `query ($id: Int, $page: Int, $perPage: Int, $search: String) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
            }
            media (id: $id, search: $search, type: ANIME) {
                id
                title {
                    romaji
                }
                siteUrl
            }
        }
    }`,
    variables:  {
        search: 'naruto',
            page: 1,
            perPage: 3
        }
};
const animeQuery = {
    query: `query ($id: Int) {
        Media(id: $id, type: ANIME) {
            id
            title {
                english
            }
            status
            genres
            coverImage {
                medium
            }
            episodes
            description
            season
            startDate {
                year
                month
                day
            }
        siteUrl
        }
    }`,
    variables: { id : 3480 }
};

// defining rest for reg slash commands
const rest = new REST({ version: '10' }).setToken(token);

// Create a new client instance
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent 
] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, c => {
	console.log(`[READY]\tLogged in as ${c.user.tag}`);
});

// interaction create event triiger function

client.on(Events.InteractionCreate, async inter => {

	// handles /search commands
	if (inter.commandName === 'search') {
		await inter.deferReply();
		const searchStr = inter.options.getString('search_query');
		const searchQ = searchQuery.variables.search = searchStr;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				query: searchQuery.query,
				variables: searchQuery.variables
			})
		};
		//new action row 
		const listRow = new ActionRowBuilder()

		// new embeds builder
		const listEmbed = new EmbedBuilder()
						.setTitle('`SEARCH RESULTS`')
						.setDescription('- select the anime you to get details about. fetched from `anilist.co API`')
						.setColor('57F287');
		try {
			const response = await (await fetch(ANILIST_URL, options)).json();
			for (const title of response.data.Page.media) {
				
				// adds ActionRows to the listRows array
				listRow.addComponents(
					new ButtonBuilder()
						.setCustomId(`ANIME_${ title.id }_${inter.user.id}`)
						.setLabel(`${ title.title.romaji }`)
						.setStyle(ButtonStyle.Primary)
				);
			}
			await inter.editReply({ embeds: [ listEmbed ], components: [ listRow ] });
			console.log(`[LOG]\t /search was used to search => ${ searchStr }`);
			
		}
		catch (err) {
			await inter.editReply('Unable to process your request!!!');
			console.error(err);
		}

	}
	// respones to button interactions

	const filter = (inter) => inter.isButton();
	const collector = inter.channel.createMessageComponentCollector({ filter, time: 15_000 });

	collector.on('collect', async i => {
		const customId = i.customId.split('_');
		const searchType = customId[0];
		const animeId = customId[1];
		const userId = customId[2];
		if (i.user.id === userId){
			await i.update({content: `Type: ${searchType}\tAnimeId: ${animeId}\tUserId: ${userId}`, embeds: [], components: []});
		}
			
	} );
	collector.on('end', collected => console.log(`Collected ${collected.size} items`));

	// handles /ping slash command
	if (inter.commandName === 'ping') {
		await inter.deferReply();
		await inter.editReply("Pong!");
		console.log(`[LOG]\t /ping was used by => ${ inter.user.tag }`);
	}
});



// async main function to reg slash commands and  logs into bot
async function main(){
	const commands = [
		searchCommand,
		pingCommand
	];

	// tries to resgister slash commands and logs into bot
	try {
		console.log(`[WAIT]\t Registering / slash commands => ${commands.length}`);
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands});
		console.log(`[DONE]\t Registered / slash commands => ${commands.length}`);

		// Log in to Discord with your client's token
		client.login(token);

	}
	catch (err) {
		console.log(err);
	}
}

main();