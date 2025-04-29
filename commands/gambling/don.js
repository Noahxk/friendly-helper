const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');
const profileModelFetcher = require("../../models/fetchers/profileModelFetcher");

module.exports= {
	data: new SlashCommandBuilder()
            .setName("don")
            .setDescription("Double or Nothing gambling game")
			.addIntegerOption(option =>
				option
					.setName("amount")
					.setDescription("The amount to gamble")
					.setRequired(true)
					.setMinValue(1)
			),
	async execute(interaction, Discord, client, fetch, perm) {

		const profileData = await profileModelFetcher.fetch(interaction.user.id);

		let gambledMoney = interaction.options.getInteger("amount");

        if(profileData.coins - gambledMoney < 0) return interaction.reply({content: `You're too poor to gamble this much money.`});

        const donData = Math.floor(Math.random() * 2);
        if(donData == 0){
            donResult = ':moneybag: Doubled! :moneybag:';

			gambledMoney *= 1;

            const response2 = await profileModel.findOneAndUpdate({
				userID: interaction.user.id,
			}, {
				$inc: {
					coins: gambledMoney
				}
			});
            amountWon = gambledMoney;
        } else {
            donResult = ':x: Nothing :x:';
            const response2 = await profileModel.findOneAndUpdate({
				userID: interaction.user.id,
			}, {
				$inc: {
					coins: -gambledMoney
				}
			});
            amountWon = gambledMoney * -1;
        }

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Double or Nothing Results')
        .addFields(
            {name: 'Result', value: donResult},
            {name: 'Amount Won', value: `${amountWon} :coin:`}
        )
		
		interaction.reply({embeds: [newEmbed]});
	}
}