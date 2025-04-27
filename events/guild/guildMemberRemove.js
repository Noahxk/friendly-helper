const options = require("../../options.json");

module.exports = async (Discord, client, member) => {
    const channel = client.channels.cache.get(options.channels.general);
    //811823088605724675

    const newEmbed = new Discord.EmbedBuilder()
		.setColor('#dafffd')
		.setTitle(`${member.user.username} has left the server.`)
        .setDescription('Hope they join back soon!')
		
		channel.send({embeds: [newEmbed]});
}