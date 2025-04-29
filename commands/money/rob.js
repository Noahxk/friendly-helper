const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');
const profileModelFetcher = require("../../models/fetchers/profileModelFetcher");

module.exports = {
	data: new SlashCommandBuilder()
            .setName("rob")
            .setDescription("Robs another user")
			.addUserOption(option =>
				option
					.setName("user")
					.setDescription("The user to rob")
					.setRequired(true)
			),
	cooldown: 120,
	async execute(interaction, Discord, client, fetch, perm) {

		const user = interaction.options.getUser("user");
		if (user.id == interaction.user.id) return interaction.reply({content: `You cannot rob yourself, its too easy.`});
		if (user.bot) return interaction.reply({content: `Better not.`});

		const profileData = profileModelFetcher.fetch(interaction.user.id);

		const profileData2 = profileModelFetcher.fetch(user.id);

		let fine = parseInt(profileData.coins * 0.1);

		if (profileData.coins < 0) return interaction.reply({content: `You can't afford to be fined.`});
		if (profileData2.coins <= 100) return interaction.reply({content: `You can't rob someone until their balance is over 100 :coin:`});

		const chance_of_success = Math.floor(Math.random() * 3);

		if(chance_of_success == 0){

			let had_padlock;
			user_has_padlock();
			async function user_has_padlock() {
				profileData2.inventory.forEach(async item =>{
					if(item.id == "padlock") {
						await profileModel.findOneAndUpdate({
							userID: user.id,
						}, {
							$pull: {
								inventory: item
							}
						});
						had_padlock = true;
					}
				});
			};

			if(had_padlock == true) {
				const newEmbed = new Discord.EmbedBuilder()
				.setColor(colour.default)
				.setTitle(`Robbery Unsuccessful`)
				.setDescription(`The victim had a padlock protecting their balance. Jet fined you ${fine} :coin:`)

			await profileModel.findOneAndUpdate({
				userID: interaction.user.id,
			}, {
				$inc: {
					coins: -fine
				}
			});

			interaction.reply({embeds: [newEmbed]});
			return 
			}

			const amount_stolen = parseInt(profileData2.coins * 0.15);

			await profileModel.findOneAndUpdate({
				userID: interaction.user.id,
			}, {
				$inc: {
					coins: amount_stolen
				}
			});

			await profileModel.findOneAndUpdate({
				userID: user.id,
			}, {
				$inc: {
					coins: -amount_stolen
				}
			});

			const newEmbed = new Discord.EmbedBuilder()
				.setColor(colour.default)
				.setTitle(`Robbery Successful`)
				.setDescription(`They robbery was successful and you stole ${amount_stolen} :coin:`)
			interaction.reply({embeds: [newEmbed]});

		} else {

			let had_radio;
			user_has_police_radio();
			async function user_has_police_radio() {
				profileData.inventory.forEach(async item =>{
					if(item.id == "police radio") {
						had_radio = true;
					}
				});
			}

			if(had_radio == true) {
				fine = parseInt(fine / 2);
			}

			await profileModel.findOneAndUpdate({
				userID: interaction.user.id,
			}, {
				$inc: {
					coins: -fine
				}
			});

			const newEmbed = new Discord.EmbedBuilder()
				.setColor(colour.default)
				.setTitle(`Robbery Unsuccessful`)
				.setDescription(`The robbery was unsuccessful and Jet fined you ${fine} :coin:`)
			interaction.reply({embeds: [newEmbed]});

		}
	}
}