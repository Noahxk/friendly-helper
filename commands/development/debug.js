const profileModel = require('../../models/profileSchema');

module.exports= {
	name: 'debug',
	description: 'A debug command for development',
	async execute(message, args, Discord, client, fetch, perm){

		let profileData;
		if(message.mentions.members.first()) {
			profileData = await profileModel.findOne({userID: message.mentions.members.first().id});
		} else {
			profileData = await profileModel.findOne({userID: message.author.id});
		}
		

		if(perm >= 3){

		const control_arg = args[0];

		switch(control_arg) {
			case "log":
				const message_to_log = args.slice(1).join(" ");
				console.log(message_to_log);
				break;
			case "echo":
				const message_to_echo = args.slice(2).join(" ");
				const echo_channel = message.mentions.channels.first();
				echo_channel.send({content: message_to_echo});
				break;
			case "dbtest":
				const newEmbed = new Discord.EmbedBuilder()
				.setColor(colour.debug)
				.setTitle('DEBUG MESSAGE')
				.setDescription(`${profileData}`)
				message.channel.send({embeds: [newEmbed]});
				break;
			default: 
				const newEmbed2 = new Discord.EmbedBuilder()
				.setColor(colour.debug)
				.setTitle('DEBUG MESSAGE')
				.setDescription(`DEBUG MESSAGE`)
				message.channel.send({embeds: [newEmbed2]});
			break;
		}
			
		} else {
			message.channel.send({content: `This command requires at least a level 3 perm.`});
		}
	}
}