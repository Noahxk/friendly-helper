const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

module.exports= {
	name: '2prps',
	description: 'Play a game of rock paper scissors with someone else!',
	async execute(message, args, Discord, client, fetch){

        const member = message.mentions.users.first();
        if(!member) return message.channel.send({content: 'You need to mention a user!'});
        if(member.id == message.author.id) return message.channel.send({content: `You can't play rock paper scissors with yourself! It's boring.`});
        if (member.bot) return message.channel.send({content: `You can't play rock paper scissors with bots!`});

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('rock')
                .setLabel('Rock')
                .setEmoji('🪨')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('paper')
                .setLabel('Paper')
                .setEmoji('🧻')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('scissors')
                .setLabel('Scissors')
                .setEmoji('✂')
                .setStyle(ButtonStyle.Primary),
        );

        let player1Choice;
        let player2Choice;
        let RPSWinner;

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Rock Paper Scissors')
        .setDescription(`${message.member} and ${member} pick something to play!`)
		
		message.channel.send({embeds: [newEmbed], components: [row]});

    const collector = message.channel.createMessageComponentCollector({ time: 15000 });

    await collector.on('collect', async i => {

        if(i.user.id == message.member.id) {
            switch(i.customId) {
                case 'rock':
                    player1Choice = 'rock';
                    p1co = ':rock: Rock';
                    break;
                case 'paper':
                    player1Choice = 'paper';
                    p1co = ':roll_of_paper: Paper';
                    break;
                case 'scissors':
                    player1Choice = 'scissors';
                    p1co = ':scissors: Scissors';
                    break;
            }
        } else if(i.user.id == member.id) {
            switch(i.customId) {
                case 'rock':
                    player2Choice = 'rock'
                    p2co = ':rock: Rock';
                    break;
                case 'paper':
                    player2Choice = 'paper';
                    p2co = ':roll_of_paper: Paper';
                    break;
                case 'scissors':
                    player2Choice = 'scissors';
                    p2co = ':scissors: Scissors';
                    break;
            }
        } else return;

        if(player1Choice != undefined && player2Choice != undefined) {
            calculateWinner(player1Choice, player2Choice);
        } else return;

        if(RPSWinner == 'p1') {
            RPSWinner = message.member;
        } else if(RPSWinner == 'p2') {
            RPSWinner = member;
        }

        const newEmbed2 = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Rock Paper Scissors Results')
        .setDescription(`
Game between ${message.member} and ${member}

**${message.author.username}:** ${p1co}
**${member.username}:** ${p2co}
        
**Winner**
${RPSWinner}
        `)

        await i.update({embeds: [newEmbed2], components: []})
        collector.stop();

    });

    function calculateWinner(p1, p2) {
        switch(p1) {
            case p2:
                RPSWinner = 'Tie';
                break;
            case 'rock':
                if(p2 == 'scissors') {
                    RPSWinner = 'p1';
                    break;
                } else if(p2 == 'paper') {
                    RPSWinner = 'p2';
                    break;
                }
            case 'paper':
                if(p2 == 'rock') {
                    RPSWinner = 'p1';
                    break;
                } else if(p2 == 'scissors') {
                    RPSWinner = 'p2';
                    break;
                }
            case 'scissors':
                if(p2 == 'paper') {
                    RPSWinner = 'p1';
                    break;
                } else if(p2 == 'rock') {
                    RPSWinner = 'p2';
                    break;
                }
        }
    }

		console.log('2 player rock paper scissors command was executed');
	}
}