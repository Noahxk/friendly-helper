const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("rps")
            .setDescription("Rock Paper Scissors with the bot")
			.addStringOption(option =>
				option
					.setName("play")
					.setDescription("Your play, Rock, Paper or Scissors")
					.setRequired(true)
					.addChoices(
						{name: "Rock", value: "rock"},
						{name: "Paper", value: "paper"},
						{name: "Scissors", value: "scissors"}
					)
			),
	cooldown: 3,
	async execute(interaction, Discord, client, fetch, perm) {

		let profileData;
		try {
			profileData = await profileModel.findOne({userID: interaction.user.id});
		}
		catch (err) {
			console.log(err);
		}

		let winner;
		const user = interaction.user;

		let bfOverlay = Math.floor(Math.random() * 3);
		if(bfOverlay == 0){
			compAnswer = ':scissors: Scissors';
		} else if(bfOverlay == 1){
			compAnswer = ':roll_of_paper: Paper';
		} else {
			compAnswer = ':rock: Rock';
		}

			 bfOverlay2 = interaction.options.getString("play").toUpperCase();

		if(bfOverlay2 == 'SCISSORS'){
			if(bfOverlay == 1){
				winner = user;
			}
		}
		if(bfOverlay2 == 'PAPER'){
			if(bfOverlay == 2){
				winner = user;
			}
		}
		if(bfOverlay2 == 'ROCK'){
			if(bfOverlay == 0){
				winner = user;
			}
		}
		if(bfOverlay2 == 'SCISSORS'){
			if(bfOverlay == 2){
				winner = 'Bot';
			}
		}
		if(bfOverlay2 == 'PAPER'){
			if(bfOverlay == 0){
				winner = 'Bot';
			}
		}
		if(bfOverlay2 == 'ROCK'){
			if(bfOverlay == 1){
				winner = 'Bot';
			}
		}
		if(bfOverlay2 == 'SCISSORS'){
			if(bfOverlay == 0){
				winner = 'Tie';
			}
		}
		if(bfOverlay2 == 'PAPER'){
			if(bfOverlay == 1){
				winner = 'Tie';
			}
		}
		if(bfOverlay2 == 'ROCK'){
			if(bfOverlay == 2){
				winner = 'Tie';
			}
		}

		if(bfOverlay2 == 'SCISSORS'){
			usrAnswer = ':scissors: Scissors';
		} else if(bfOverlay2 == 'PAPER'){
			usrAnswer = ':roll_of_paper: Paper';
		} else if(bfOverlay2 == 'ROCK') {
			usrAnswer = ':rock: Rock';
		} else {
			usrAnswer = 'Invalid Answer'
			winner = 'An error occurred'
		}

		const gunChance = Math.floor(Math.random() * 81);
		if(gunChance == 75){
			winner = 'Bot';
			compAnswer = ':gun: Gun'
		}

		if(winner == user){
			rdmNumber = Math.floor(Math.random() * (21 - 15) + 15);
			const response = await profileModel.findOneAndUpdate({
				userID: interaction.user.id,
			}, {
				$inc: {
					coins: rdmNumber
				}
			});
		} else {
			rdmNumber = 0;
		}

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle(`Scissors Paper Rock Results`)
		.addFields(
			{name: 'User Answer:', value: usrAnswer},
			{name: 'Bot Answer:', value: compAnswer},
			{name: 'Winner:', value: `
			${winner}
Money Received: ${rdmNumber} :coin:`}
		)
		
		interaction.reply({embeds: [newEmbed]});
		console.log(`${interaction.user.username} used ${interaction.commandName}`);
	}
}