const profileModel = require('../../models/profileSchema');
const options = require("../../resources/options.json");

module.exports = async (Discord, client, member) => {

    let nmProfileData;
		try {
			nmProfileData = await profileModel.findOne({userID: member.id});
			if(!nmProfileData) {
				let profile = await profileModel.create({
					userID: member.id,
					username: member.user.username,
					coins: 100,
					inventory: [],
                    theme: '#dafffd',
					cosmetics: [],
					marriedTo: 'Not Married',
                    permissionLevel: 1
				})
			}
		}
		catch (err) {
			console.log(err);
		}

    const channel = client.channels.cache.get(options.channels.general);
	//811823088605724675

    const newEmbed = new Discord.EmbedBuilder()
		.setColor('#dafffd')
		.setTitle(`${member.user.username} has joined the server!`)
        .setDescription('Welcome to The Friend Group! We hope you enjoy the server!')
		
		channel.send({content: '<@&820411772917645372>', embeds: [newEmbed]});
}