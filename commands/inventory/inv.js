const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');
const profileModelFetcher = require("../../models/fetchers/profileModelFetcher");

module.exports= {
	data: new SlashCommandBuilder()
            .setName("inv")
            .setDescription("Shows your inventory")
			.addUserOption(option =>
				option
					.setName("user")
					.setDescription("The user to view the inventory of")
					.setRequired(false)
			),
	async execute(interaction, Discord, client, fetch, perm) {

		if(!interaction.options.getUser("user")) {

        const profileData = await profileModelFetcher.fetch(interaction.user.id);

			if(profileData.inventory.length != 0){
				let inv = [];
				profileData.inventory.forEach(item =>{
					inv.push(item.display_name);
				});
				invData = inv.join('\n')
			} else {
				invData = `Empty`
			}

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Inventory')
        .setDescription(invData)
		
		interaction.reply({embeds: [newEmbed]});

		} else if(interaction.options.getUser("user")){

		const user = interaction.options.getUser("user");

		if (user.bot) return message.channel.send({content: `Bots don't own anything.`})

		const profileData = await profileModelFetcher.fetch(user.id);

		if(profileData.inventory.length != 0){
			let inv = [];
			profileData.inventory.forEach(item =>{
				inv.push(item.display_name);
			});
			invData = inv.join('\n')
		} else {
			invData = `Empty`
		}

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle(`${user.username}'s Inventory`)
        .setDescription(invData)

		interaction.reply({embeds: [newEmbed]});

		} else {
			return interaction.reply({content: `To be honest I don't know how you got to this message, good job - Noah`});
		}

		console.log(`${interaction.user.username} used ${interaction.commandName}`);
	}
}