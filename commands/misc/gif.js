require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("gif")
            .setDescription("Fetches a gif from giphy.com")
			.addStringOption(option =>
				option
					.setName("query")
					.setDescription("What to search for on giphy.com")
					.setRequired(true)
			),
	execute(interaction, Discord, client, fetch, perm) {

		const query = interaction.options.getString("query");

		function sendApiRequest() {
			const giphyApiKey = process.env.GIPHY_TOKEN;
			const giphyApiURL = `https://api.giphy.com/v1/gifs/search?q=${query}&rating=g&api_key=${giphyApiKey}`;

			fetch(giphyApiURL).then(function(data) {
				return data.json()
			})
			.then(function(json){
				imgPath = json.data[0].images.original.url;
				interaction.reply({content: imgPath});
			})
		}

		sendApiRequest();
		console.log(`${interaction.user.username} used ${interaction.commandName}`);
	}
}