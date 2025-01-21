const { ActivityType } = require('discord.js');

module.exports= {
	name: 'botactivity',
	description: "Sets the bot's activity to the content of the message'",
	execute(message, args, Discord, client, fetch, perm){

		if(perm >= 3){
		console.log('Permission Check = True');

		if(!args[0]) return message.channel.send({content: 'You need to include the type of activity!'});
		if(!args[1]) return message.channel.send({content: 'You need to include an activity!'});

		const activityTypeData = args[0].toUpperCase();
		const activityInput = args.slice(1).join(' ');

		if(activityTypeData == 'PLAYING') {
			activityTypeExport = ActivityType.Playing;
			activityTypeOverlay = ':video_game: Playing';
		} else if(activityTypeData == 'LISTENING') {
			activityTypeExport = ActivityType.Listening;
			activityTypeOverlay = ':headphones: Listening';
		} else if(activityTypeData == 'WATCHING') {
			activityTypeExport = ActivityType.Watching;
			activityTypeOverlay = ':eye: Watching';
		} else {
			return message.channel.send({content: 'The type needs to be Playing, Listening or Watching!'});
		}

		client.user.setPresence({
			activities: [{ name: activityInput, type: activityTypeExport }],
			status: 'online',
		  });

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Activity Set')
		.setDescription(`
		**Type:** ${activityTypeOverlay}
		**Activity:** ${activityInput}
		`) 
		
		message.channel.send({embeds: [newEmbed]});
		console.log(`Bot Activity command was executed and Activity was set to ${activityTypeData} ${activityInput}`);
		} else {
			console.log('Permission Check = False');
			message.channel.send({content: `You don't have permission to change the activity of this bot!`})
		}
	}
}