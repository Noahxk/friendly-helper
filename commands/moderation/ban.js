const { SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("ban")
            .setDescription("Ban someone from the server")
            .addUserOption(option =>
                option
                    .setName("user")
                    .setDescription("The user to ban")
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName("reason")
                    .setDescription("The reason for the ban")
                    .setRequired(false)
            ),
	execute(interaction, Discord, client, fetch, perm) {

        if(perm >= 2){

        const member = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") ?? "Banned by moderator";

        if(member.id == interaction.user.id) return interaction.reply({content: `You really want to leave that badly?`});
        if(!member.bannable) return interaction.reply({content: `Error: Member unbannable`});

        member.ban({reason: reason});

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Member Banned')
        .addFields(
            {name: 'Banned Member', value: `${member}`},
            {name: 'Moderator', value: `${interaction.user}`}
        )
		
		interaction.reply({embeds: [newEmbed]});
        } else {
            return interaction.reply({content: `You need at least perm level 2. Stop trying to ban people.`});
        }
	}
}