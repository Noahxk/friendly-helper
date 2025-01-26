const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("help")
            .setDescription("Shows all the command uses")
			.addStringOption(option =>
				option
					.setName("category")
					.setDescription("The category of commands")
					.addChoices(
						{name: "Utility", value: "utility"},
						{name: "Fun", value: "fun"},
						{name: "Economy", value: "economy"},
						{name: "Admin", value: "admin"}
					)
					.setRequired(false)
			),
	async execute(interaction, Discord, client, fetch, perm) {

		if(perm >= 2){
		helpRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('utility')
                .setLabel('Utility')
                .setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
                .setCustomId('fun')
                .setLabel('Fun')
                .setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
                .setCustomId('economy')
                .setLabel('Economy')
                .setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
                .setCustomId('admin')
                .setLabel('Admin')
                .setStyle(ButtonStyle.Danger),
		);
		} else {
			helpRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('utility')
                .setLabel('Utility')
                .setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
                .setCustomId('fun')
                .setLabel('Fun')
                .setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
                .setCustomId('economy')
                .setLabel('Economy')
                .setStyle(ButtonStyle.Primary),
		);
		}

		const utilityEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Bot Utility Commands')
		.setDescription(`Prefix: /\n**Note:** Underlined commands can be used by Jet.`)
		.addFields({name: '__Utility Commands__', value: `
**Help** - Shows this menu
**Ping** - Shows if the bot is responsive
**__Avatar__** - Sends the user's avatar URL
**__Theme__** - Sets your theme and makes that colour appear on bot messages
**Giveaway** - Lets you join or leave an active giveaway
**Debug** - Used for debugging
		`})

		const funEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Bot Fun Commands')
		.setDescription(`Prefix: /\n**Note:** Underlined commands can be used by Jet.`)
		.addFields({name: '__Fun Commands__', value: `
**Rps** - Play scissors paper rock against a bot (Gives you $15-$20 if you win)
**2prps** - Play scissors paper rock against someone else
**GIF** - Sends a gif from giphy.com
		`})

		const economyEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Bot Economy Commands')
		.setDescription(`Prefix: /\n**Note:** Underlined commands can be used by Jet.`)
		.addFields({name: '__Economy Commands__', value: `
**__Bal__** - Shows you how much money you have or the pinged user's balance
**Pay** - Sends that person the specified amount of money
**__Don__** - Either doubles the amount or you lose it
**Shop** - View or buy something in the shop
**Inv** - Shows all the things you have in your inventory or the pinged user's inventory
**Rob** - Attempts to rob the user, results in either a success or a hefty fine
**Fish** - Lets you fish for money
**Daily** - Lets you claim your daily money every 24 hours
**Equip** - Lets you equip an owned cosmetic role
**__Slots__** - Lets you gamble your money on a slot machine, 73x your bet if you win
**__Baltop__** - Shows the balance leaderboard
**Roulette** - European Roulette, 2 to 1 payout on wide bets, 35 to 1 payout on specific numbers
		`})

		const adminEmbed = new Discord.EmbedBuilder()
		.setColor(colour.admin)
		.setTitle('Bot Admin Commands')
		.setDescription(`Prefix: /\n**Note:** Underlined commands can be used by Jet.`)
		.addFields({name: '__Admin Commands__', value: `
**__BotActivity__** - Sets the bot's activity. Type = Listening, watching, playing
**__Reboot__** - Reboots the bot
**__Ban__** - Bans the member from the server
**__Kick__** - Kicks the member from the server
**Giveaway** - Used to start or end a giveaway
		`})

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Please Select a Category')
		.setDescription(`Select a category using the buttons below\n**Note:** Underlined commands can be used by Jet.`)

		const category = interaction.options.getString("category");

		if(!category) {

		const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

    	await collector.once('collect', async i => {
			switch(i.customId) {
				case 'utility':
					i.update({embeds: [utilityEmbed], components: []});
					break;
				case 'fun':
					i.update({embeds: [funEmbed], components: []});
					break;
				case 'economy':
					i.update({embeds: [economyEmbed], components: []});
					break;
				case 'admin':
					i.update({embeds: [adminEmbed], components: []});
					break;
			}
			collector.stop();
		});
		
		interaction.reply({embeds: [newEmbed], components: [helpRow]});

		} else if(category.toUpperCase() == 'UTILITY') {
			interaction.reply({embeds: [utilityEmbed]});
		} else if(category.toUpperCase() == 'FUN') {
			interaction.reply({embeds: [funEmbed]});
		} else if(category.toUpperCase() == 'ECONOMY') {
			interaction.reply({embeds: [economyEmbed]});
		}else if(category.toUpperCase() == 'ADMIN') {
			if(perm >= 2) {
			interaction.reply({embeds: [adminEmbed]});
			} else return interaction.reply({content: `You need at least level 2 perm to view these commands.`});
		} else return interaction.reply({content: 'Invalid Category'});

		console.log(`${interaction.user.username} used ${interaction.commandName}`);
	}
}