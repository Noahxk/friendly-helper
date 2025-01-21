const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');

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
			
		let profileData;
		try {
			profileData = await profileModel.findOne({userID: interaction.user.id});
		}
		catch (err) {
			console.log(err);
		}
		
		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Your Balance')
		.setDescription(`:coin: **${profileData.coins}**`)
		interaction.reply({embeds: [newEmbed]});

		} else if(interaction.options.getUser("user")) {

		const user = interaction.options.getUser("user");

		if (user.bot) return interaction.reply({content: `Bots don't have bank accounts.`})

		let profileData2;
		try {
			profileData2 = await profileModel.findOne({userID: user.id});
			if(!profileData2) {
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

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle(`${user.username}'s Balance`)
        .setDescription(`:coin: **${profileData2.coins}**`)
		interaction.reply({embeds: [newEmbed]});

		}

		console.log(`${interaction.user.username} used ${interaction.commandName}`);
	}
}