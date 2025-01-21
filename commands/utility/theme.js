const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("theme")
            .setDescription("Lets you change your theme colour")
			.addStringOption(option =>
				option
					.setName("hexcode")
					.setDescription("The hexcode of the colour to make your theme")
					.setRequired(true)
			),
	async execute(interaction, Discord, client, fetch, perm){

		const hexcode = interaction.options.getString("hexcode");

        let theme = hexcode.toUpperCase();
            if(theme.startsWith('#')) {
                theme = theme.slice(1);
            }
            const regex = /[0-9A-Fa-f]{6}/g;
            if(!theme.match(regex) || theme.length != 6) return interaction.reply({content: "Invalid hexcode."});
            const themeOutput = '#' + theme;

        const response = await profileModel.findOneAndUpdate({
            userID: interaction.user.id,
        }, {
            $set: {
                theme: themeOutput
            }
        });

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(themeOutput)
		.setTitle('Theme Set')
        .setDescription(`Your theme was set to **${themeOutput}**`)
		
		interaction.reply({embeds: [newEmbed]});
		console.log(`${interaction.user.username} used ${interaction.commandName}`);
	}
}