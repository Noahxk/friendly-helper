module.exports= {
	name: 'colour',
	description: 'A command for different colour related things',
	execute(message, args, Discord, client, fetch){

        if(!args[0]) return message.channel.send({content: 'You need to include a control argument!'});
        if(args[0] == 'random') {

        function getRandomColour() {
            let letters = '0123456789ABCDEF';
            randomColour = '#';
            for (var i = 0; i < 6; i++) {
                randomColour += letters[Math.floor(Math.random() * 16)];
            }
            return randomColour;
            }
            getRandomColour()

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(randomColour)
		.setTitle(randomColour)

        message.channel.send({embeds: [newEmbed]});
		console.log('Colour command was executed');

        } else {
            let colourData = args[0].toUpperCase();
            if(colourData.startsWith('#')) {
                colourData = colourData.slice(1);
            }
            const regex = /[0-9A-Fa-f]{6}/g;
            if(!colourData.match(regex) || colourData.length != 6) return message.channel.send({content: 'That is not a valid hex code!'});
            const colourOutput = '#' + colourData;
            
            const newEmbed = new Discord.EmbedBuilder()
		    .setColor(colourOutput)
		    .setTitle(colourOutput)

            message.channel.send({embeds: [newEmbed]});
		    console.log('Colour command was executed');
        }

	}
}