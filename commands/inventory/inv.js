const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');

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

        let profileData;
		try {
			profileData = await profileModel.findOne({userID: interaction.user.id});
		}
		catch (err) {
			console.log(err);
		}

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

		let profileData;
		try {
			profileData = await profileModel.findOne({userID: user.id});
			if(!profileData) {
				let profile = await profileModel.create({
					userID: user.id,
					username: user.username,
					coins: 100,
                    inventory: [],
					theme: '#dafffd',
					cosmetics: [],
					marriedTo: 'Not Married',
                    permissionLevel: 1
				})
				return interaction.reply({content: 'Creating user profile, please try again!'});
			}
		}
		catch (err) {
			console.log(err);
		}

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