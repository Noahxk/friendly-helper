const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Replies with Pong!"),
    async execute(interaction, Discord, client, fetch, perm) {

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Pong!')

        interaction.reply({embeds: [newEmbed]});
		console.log(`${interaction.user.username} used ${interaction.commandName}`);
    }
}