module.exports= {
	name: 'botdown',
	description: "Sends a message in the channel saying that it's bot is offline",
	execute(message, args, Discord, client, fetch, perm){

		if(perm >= 2){
			console.log('Permission Check = True');

		const botChannels = [
			{id: '811836016373268513', botNeeded: 'Counting Bot'},
			{id: '811824820881850368', botNeeded: 'Arcane'},
			{id: '816178107656306689', botNeeded: 'Carl Bot'},
			{id: '904149557921853450', botNeeded: 'Gartic Bot'},
			{id: '961919120591446046', botNeeded: 'Appy'},
			{id: '812594011424423976', botNeeded: 'Test Bot'}
		];

		botChannels.forEach(channel => {

			if(channel.id == message.channel.id){
				const newEmbed = new Discord.EmbedBuilder()
				.setColor(colour.admin)
				.setTitle(`:warning: ${channel.botNeeded} Offline :warning:`)
				.setDescription(`This channel needs ${channel.botNeeded} to operate and it is offline. Please \n don't use this channel until it is online again, Thankyou!`)
		
				message.channel.send({embeds: [newEmbed]});
				message.delete();
			}

		});
		 
		} else {
			console.log('Permission Check = False');
			message.channel.send({content: "You don't have permission to use this command!"});
		}
	}
}