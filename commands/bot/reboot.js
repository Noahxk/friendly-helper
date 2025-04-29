const { SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("reboot")
            .setDescription("Reboots the bot"),
	async execute(interaction, Discord, client, fetch, perm) {

		if(perm < 3) return interaction.reply({content: "Insufficient permissions to reboot bot"});

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.admin)
		.setTitle('Rebooting')
		.setDescription('Friendly Helper is rebooting')
		.setFooter({text: `Server functions will temporarily halt`})
		
		await interaction.reply({embeds: [newEmbed]});

		process.exit(0);
	}
}