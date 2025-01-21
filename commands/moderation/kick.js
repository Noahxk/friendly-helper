const { SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("kick")
            .setDescription("Kick a user from the server")
            .addUserOption(option =>
                option
                    .setName("user")
                    .setDescription("The user to kick")
                    .setRequired(true)
            ),
	execute(interaction, Discord, client, fetch, perm) {

        if(perm >= 2){

        const member = interaction.options.getMember("user");

        if(member.id == interaction.user.id) return interaction.reply({content: `You really want to leave that badly?`});
        if(!member.kickable) return interaction.reply({content: `Error: User unkickable.`});

        member.kick();

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Member Kicked')
        .addFields(
            {name: 'Kicked Member', value: `${member}`},
            {name: 'Moderator', value: `${interaction.user}`}
        )
		
		interaction.reply({embeds: [newEmbed]});
		console.log(`${interaction.user.username} used ${interaction.commandName} to kick ${member.username}`);
        } else {
            return interaction.reply({content: `You need at least a level 2 perm to use this.`});
        }
	}
}