const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("debug")
            .setDescription("Command to help with debugging")
			.addSubcommand(subcommand =>
				subcommand
					.setName("log")
					.setDescription("Log a message to the console")
					.addStringOption(option =>
						option
							.setName("message")
							.setDescription("The message to log")
							.setRequired(true)
					)
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName("echo")
					.setDescription("Send a message to another channel")
					.addChannelOption(option =>
						option
							.setName("channel")
							.setDescription("The channel to send the message to")
							.setRequired(true)
							.addChannelTypes(ChannelType.GuildText)
					)
					.addStringOption(option =>
						option
							.setName("message")
							.setDescription("The message to sned to the channel")
							.setRequired(true)
					)
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName("dbtest")
					.setDescription("Test database by fetching profile model of a user")
					.addUserOption(option =>
						option
							.setName("user")
							.setDescription("The user to get the profile model of")
							.setRequired(true)
					)
			),
	async execute(interaction, Discord, client, fetch, perm) {

		switch(interaction.options.getSubcommand()) {
			case "log":
				const log_message = interaction.options.getString("message");
				console.log(log_message);
				interaction.reply({content: "Message Logged"});
				break;
			case "echo":
				const echo_message = interaction.options.getString("message");
				const echo_channel = interaction.options.getChannel("channel");
				echo_channel.send({content: echo_message});
				interaction.reply({content: "Message Echoed"});
				break;
			case "dbtest":

				let profileData;
				try{
					profileData = await profileModel.findOne({userID: interaction.options.getUser("user").id});
				} catch (err) {
					console.log(err);
				}

				const newEmbed = new Discord.EmbedBuilder()
				.setColor(colour.debug)
				.setTitle('DEBUG MESSAGE')
				.setDescription(`\`\`\`${profileData}\`\`\``)
				interaction.reply({embeds: [newEmbed]});
				break;
		}
		console.log(`${interaction.user.username} used ${interaction.commandName}`);
	}
}