const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("baltop")
            .setDescription("Shows the balance leaderboard"),
	async execute(interaction, Discord, client, fetch, perm) {

        let leaderboard = [];
        const list = (await profileModel.find({coins: {$gte: 1}}).exec()).sort((a, b) => b.coins - a.coins);
        list.forEach((user) => {
            leaderboard.push(`**${leaderboard.length + 1}.** <@${user.userID}> - ${user.coins} :coin:`);
        });

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Balance Leaderboard')
        .setDescription(leaderboard.join('\n'))
		
		interaction.reply({embeds: [newEmbed]});
		console.log(`${interaction.user.username} used ${interaction.commandName}`);
	}
}