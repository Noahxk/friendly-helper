const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');
const profileModelFetcher = require("../../models/fetchers/profileModelManager");

module.exports= {
	data: new SlashCommandBuilder()
            .setName("roulette")
            .setDescription("A game of European Roulette")
			.addStringOption(option =>
				option
					.setName("bet")
					.setDescription("On which specific number or group of numbers you bet your money on")
					.setRequired(true)
			)
			.addIntegerOption(option =>
				option
					.setName("money")
					.setDescription("The amount of money to put on your bet")
					.setMinValue(1)
					.setRequired(true)
			),
	async execute(interaction, Discord, client, fetch, perm) {

		const profileData = await profileModelFetcher.fetch(interaction.user.id);

		let bet = interaction.options.getString("bet");
		const valid_bets = [
			"red", "black", "odd", "even", "low", "high"
		];
		if(isNaN(bet)) {
			if(!valid_bets.includes(bet)) return interaction.reply({content: "Invalid bet, valid bets include: red, black, odd, even, low, high or a specific number from 0-36"});
		} else {
			if(bet < 0 || bet > 36) return interaction.reply({content: "Invalid bet, valid bets include: red, black, odd, even, low, high or a specific number from 0-36"});
		}

		let money = interaction.options.getInteger("money");
		if(profileData.coins - money < 0) return interaction.reply({content: "You don't have enough money to do that."});

		
		const groups = new Map();
		groups.set("red", [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
		groups.set("black", [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 33, 31, 35]);
		groups.set("odd", [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27,29, 31, 33, 35]);
		groups.set("even", [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36]);
		groups.set("low", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
		groups.set("high", [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]);

		const generated_number = Math.floor(Math.random() * 37);

		let payout_multiplier;
		check_if_winning_bet();
		function check_if_winning_bet() {
			if(isNaN(bet)) {
				if(groups.get(bet).includes(generated_number)) {
					payout_multiplier =  2;
				} else {
					payout_multiplier =  -1;
				}
			} else {
				if(generated_number == bet) {
					payout_multiplier =  35;
				} else {
					payout_multiplier =  -1;
				}
			}
		}

		const payout = await calculate_payout();
		async function calculate_payout() {
			const payout = money * payout_multiplier;
			const response = await profileModel.findOneAndUpdate({
				userID: interaction.user.id,
			}, {
				$inc: {
					coins: payout
				}
			});
			return payout;
		}

		if(isNaN(bet)) bet = bet.charAt(0).toUpperCase() + bet.slice(1);
		
		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Roulette Results')
        .addFields(
            {name: 'Your Bet', value: `${money} :coin: on ${bet}`},
			{name: "Winning Number", value: `${generated_number}`},
            {name: 'Amount Won', value: `${payout} :coin:`}
        )
		
		interaction.reply({embeds: [newEmbed]})
	}
}