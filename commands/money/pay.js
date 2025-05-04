const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');
const profileModelFetcher = require('../../models/fetchers/profileModelManager');

module.exports = {
	data: new SlashCommandBuilder()
            .setName("pay")
            .setDescription("Pays a user")
			.addUserOption(option =>
				option
					.setName("user")
					.setDescription("The user to pay")
					.setRequired(true)
			)
			.addIntegerOption(option =>
				option
					.setName("amount")
					.setDescription("The amount to pay the user")
					.setMinValue(1)
					.setRequired(true)
			),
	async execute(interaction, Discord, client, fetch, perm) {

		const profileData = profileModelFetcher.fetch(interaction.user.id);

		const user = interaction.options.getUser("user");
		if (user.id == interaction.user.id) return interaction.reply({content: `You cannot pay yourself.`});
		if (user.bot) return interaction.reply({content: `You cannot pay a bot.`})

		const profileData2 = profileModelFetcher.fetch(user.id);

		const money = interaction.options.getInteger("amount");

		if (profileData.coins - money < 0) return interaction.reply({content: `You don't have enough money to do that.`});

		const response = await profileModel.findOneAndUpdate({
			userID: interaction.user.id,
		}, {
			$inc: {
				coins: -money
			}
		});

		const response2 = await profileModel.findOneAndUpdate({
			userID: user.id,
		}, {
			$inc: {
				coins: money
			}
		});

		const newEmbed = new Discord.EmbedBuilder()
			.setColor(colour.default)
			.setTitle('Paid')
			.setDescription(`${user} was paid ${money} :coin:`);

		interaction.reply({embeds: [newEmbed]});
	}
}