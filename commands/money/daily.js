const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("daily")
            .setDescription("Your daily money intake"),
	cooldown: 79200,
	async execute(interaction, Discord, client, fetch, perm) {

		let profileData;
		try {
			profileData = await profileModel.findOne({userID: interaction.user.id});
		}
		catch (err) {
			console.log(err);
		}

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
		console.log(`${interaction.user.username} used ${interaction.commandName}`);
	}
}