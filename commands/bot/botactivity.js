const { ActivityType, SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("botactivity")
            .setDescription("Sets the activity of the bot")
			.addStringOption(option =>
				option
					.setName("type")
					.setDescription("The type of activity")
					.setRequired(true)
					.addChoices(
						{name: "Playing", value: "playing"},
						{name: "Watching", value: "watching"},
						{name: "Listening To", value: "listening"}
					)
			)
			.addStringOption(option =>
				option
					.setName("activity")
					.setDescription("The text that follows the type")
					.setRequired(true)
			),
	execute(interaction, Discord, client, fetch, perm) {

		let type = interaction.options.getString("type");
		const activity = interaction.options.getString("activity");

		switch(type) {
			case "playing":
				type = ActivityType.Playing;
				break;
			case "watching":
				type = ActivityType.Watching
				break;
			case "listening":
				type = ActivityType.Listening
				break;
		}

		client.user.setPresence({
			activities: [{ name: activity, type: type }],
			status: 'online',
		  });

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Activity Set')
		.setDescription(`
		**Type:** ${type}
		**Activity:** ${activity}
		`) 
		
		interaction.reply({embeds: [newEmbed]});
	}
}