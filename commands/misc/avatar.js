const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName("avatar")
            .setDescription("Get the profile picture of a user")
            .addUserOption(option =>
                option
                    .setName("user")
                    .setDescription("The user to get the pfp of")
                    .setRequired(true)
            ),
    execute(interaction, Discord, client, fetch, perm) {

        const user = interaction.options.getUser("user");
        const imgURL = user.displayAvatarURL();

        interaction.reply({content: imgURL});
        console.log(`${interaction.user.username} used ${interaction.commandName}`);
    }
}