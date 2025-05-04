const { SlashCommandBuilder } = require('discord.js');
const profileModelFetcher = require("../../models/fetchers/profileModelManager");

module.exports= {
	data: new SlashCommandBuilder()
            .setName("bal")
            .setDescription("Show your balance or someone else's")
			.addUserOption(option =>
				option
					.setName("user")
					.setDescription("The user you want to view the balance of")
					.setRequired(false)
			),
	async execute(interaction, Discord, client, fetch, perm) {

		if(!interaction.options.getUser("user")){
			
		const profileData = await profileModelFetcher.fetch(interaction.user.id);
		
		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Your Balance')
		.setDescription(`:coin: **${profileData.coins}**`)
		interaction.reply({embeds: [newEmbed]});

		} else if(interaction.options.getUser("user")) {

		const user = interaction.options.getUser("user");
		if (user.bot) return interaction.reply({content: `Bots don't have bank accounts.`})
		const profileData = await profileModelFetcher.fetch(user.id);

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle(`${user.username}'s Balance`)
        .setDescription(`:coin: **${profileData.coins}**`)
		interaction.reply({embeds: [newEmbed]});

		}
	}
}