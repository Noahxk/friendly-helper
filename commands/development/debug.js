const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder, ChannelType, ContainerBuilder} = require('discord.js');
const profileModelFetcher = require("../../models/fetchers/profileModelFetcher");
const { V2ComponentBuilder, V2TextDisplay, V2ContainerBuilder, V2ActionRowBuilder, V2ButtonBuilder, V2Separator } = require("v2componentsbuilder");
const { ButtonStyle } = require("discord.js");

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
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName("component")
					.setDescription("Test discord message component")
			),
	async execute(interaction, Discord, client, fetch, perm) {

		switch(interaction.options.getSubcommand()) {
			case "log":
				const log_message = interaction.options.getString("message");
				console.log(log_message);
				interaction.reply({content: "Message Logged"});
				break;
			case "echo":
				if(perm < 2) return interaction.reply({content: "Insufficient permissions"});
				const echo_message = interaction.options.getString("message");
				const echo_channel = interaction.options.getChannel("channel");
				echo_channel.send({content: echo_message});
				interaction.reply({content: "Message Echoed"});
				break;
			case "dbtest":
				const profileData = await profileModelFetcher.fetch(interaction.user.id);

				const newEmbed = new Discord.EmbedBuilder()
				.setColor(colour.debug)
				.setTitle('DEBUG MESSAGE')
				.setDescription(`\`\`\`${profileData}\`\`\``)
				interaction.reply({embeds: [newEmbed]});
				break;
			case "component":
				const components = new V2ComponentBuilder().addComponents([
					new V2ContainerBuilder().setComponents([
						new V2TextDisplay("Enter Code:"),
						new V2Separator(),

						new V2ActionRowBuilder()
							.setComponents([
								new V2ButtonBuilder()
									.setLabel("7")
									.setCustomId("7")
									.setStyle(ButtonStyle.Secondary),
								new V2ButtonBuilder()
									.setLabel("8")
									.setCustomId("8")
									.setStyle(ButtonStyle.Secondary),
								new V2ButtonBuilder()
									.setLabel("9")
									.setCustomId("9")
									.setStyle(ButtonStyle.Secondary)
							]),

						new V2ActionRowBuilder()
							.setComponents([
								new V2ButtonBuilder()
									.setLabel("4")
									.setCustomId("4")
									.setStyle(ButtonStyle.Secondary),
								new V2ButtonBuilder()
									.setLabel("5")
									.setCustomId("5")
									.setStyle(ButtonStyle.Secondary),
								new V2ButtonBuilder()
									.setLabel("6")
									.setCustomId("6")
									.setStyle(ButtonStyle.Secondary)
							]),

						new V2ActionRowBuilder()
							.setComponents([
								new V2ButtonBuilder()
									.setLabel("1")
									.setCustomId("1")
									.setStyle(ButtonStyle.Secondary),
								new V2ButtonBuilder()
									.setLabel("2")
									.setCustomId("2")
									.setStyle(ButtonStyle.Secondary),
								new V2ButtonBuilder()
									.setLabel("3")
									.setCustomId("3")
									.setStyle(ButtonStyle.Secondary)
							]),

						new V2ActionRowBuilder()
							.setComponents([
								new V2ButtonBuilder()
									.setLabel("0")
									.setCustomId("0")
									.setStyle(ButtonStyle.Secondary)
						])
					])
				]);
				interaction.reply(components.toJSON());

				break;
		}
	}
}