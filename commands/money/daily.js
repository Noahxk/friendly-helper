const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');
const profileModelFetcher = require('../../models/fetchers/profileModelManager');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("daily")
            .setDescription("Your daily money intake"),
	cooldown: 79200,
	async execute(interaction, Discord, client, fetch, perm) {

		const profileData = await profileModelFetcher.fetch(interaction.user.id);

		const dailyPay = Math.floor(Math.random() * (291 - 150) + 150);

		const response = await profileModel.findOneAndUpdate({
			userID: interaction.user.id,
		}, {
			$inc: {
				coins: dailyPay
			}
		});
        
		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Daily Reward')
		.setDescription(`You were paid ${dailyPay} :coin:`)
		.setFooter({text: 'Come back in 22 hours to claim your money again!'})
		
		interaction.reply({embeds: [newEmbed]});
	}
}