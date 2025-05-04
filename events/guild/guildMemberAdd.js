const profileModel = require('../../models/profileSchema');
const options = require("../../options.json");
const profileModelFetcher = require('../../models/fetchers/profileModelManager');

module.exports = async (Discord, client, member) => {

	profileModelFetcher.create(member.id);

    const channel = client.channels.cache.get(options.channels.general);
	//811823088605724675

    const newEmbed = new Discord.EmbedBuilder()
		.setColor('#dafffd')
		.setTitle(`${member.user.username} has joined the server!`)
        .setDescription('Welcome to The Friend Group! We hope you enjoy the server!')
		
		channel.send({content: `<@&820411772917645372>`, embeds: [newEmbed]});
}