const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("2prps")
            .setDescription("Play rps with someone")
            .addUserOption(option =>
                option
                    .setName("player2")
                    .setDescription("Who you want to play against")
                    .setRequired(true)
            ),
	async execute(interaction, Discord, client, fetch, perm) {

        const member = interaction.options.getUser("player2");

        if(member.id == interaction.user.id) return interaction.reply({content: `You cannot play rps with yourself, its depressing.`});
        if (member.bot) return interaction.reply({content: `Don't bother the bots with your games.`});

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
        .setDescription(`${interaction.user} and ${member} pick something to play!`)
		
		interaction.reply({embeds: [newEmbed], components: [row]});

    const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

    await collector.on('collect', async i => {

        if(i.user.id == interaction.user.id) {
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
            RPSWinner = interaction.user;
        } else if(RPSWinner == 'p2') {
            RPSWinner = member;
        }

        const newEmbed2 = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Rock Paper Scissors Results')
        .setDescription(`
Game between ${interaction.user} and ${member}

**${interaction.user.username}:** ${p1co}
**${member.username}:** ${p2co}
        
**Winner**
${RPSWinner}
        `)

        await interaction.editReply({embeds: [newEmbed2], components: []})
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

    console.log(`${interaction.user.username} used ${interaction.commandName}`);
	}
}