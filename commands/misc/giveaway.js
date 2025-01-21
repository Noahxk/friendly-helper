const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const giveawayModel = require("../../models/giveawaySchema");
const {nanoid} = require("nanoid");

module.exports= {
	data: new SlashCommandBuilder()
            .setName("giveaway")
            .setDescription("Everything to do with giveaways")
            .addSubcommand(subcommand =>
                subcommand
                    .setName("start")
                    .setDescription("Start a giveaway")
                    .addStringOption(option =>
                        option
                            .setName("prize")
                            .setDescription("The giveaway's prize")
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName("end")
                    .setDescription("End a giveaway")
                    .addStringOption(option =>
                        option
                            .setName("giveawayid")
                            .setDescription("The ID of the giveaway to end")
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName("join")
                    .setDescription("Join a giveaway")
                    .addStringOption(option =>
                        option
                            .setName("giveawayid")
                            .setDescription("The ID of the giveaway to join")
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                    subcommand
                        .setName("leave")
                        .setDescription("Leave a giveaway")
                        .addStringOption(option =>
                            option
                                .setName("giveawayid")
                                .setDescription("The ID of the giveaway to leave")
                                .setRequired(true)
                        )
            ),
	async execute(interaction, Discord, client, fetch, perm) {

        switch(interaction.options.getSubcommand()) {
            case "start":
                if(perm >= 2) {

                    const new_giveaway_id = nanoid(6);
                    const prize = interaction.options.getString("prize");

                    while(await giveawayModel.findOne({giveawayID: new_giveaway_id})) {
                        new_giveaway_id = nanoid(6);
                    }
                    
                    try {

                        giveawayModel.create({
                            giveawayID: new_giveaway_id,
                            pool: [],
                            prize: prize
                        });

                    } catch(err) {
                        console.log(err);
                        return interaction.reply({content: "There was an issue creating this giveaway."});
                    }

                    const newEmbed = new Discord.EmbedBuilder()
		                .setColor(colour.server)
		                .setTitle(`:tada: Giveaway Started :tada:`)
                        .setDescription(`Use /giveaway join (id) to join`)
                        .addFields(
                            {name: "Prize", value: prize}
                        )
                        .setFooter({text: `Giveaway ID: ${new_giveaway_id}`})

                    interaction.reply({content: "Giveaway Started.", flags: MessageFlags.Ephemeral});
                    interaction.guild.channels.cache.get("1043332883089215579").send({embeds: [newEmbed]});

                } else {
                    return interaction.reply({content: "You need at least perm level 2 to start a giveaway."})
                }
                break;
            case "end":

                const giveawayID_end = interaction.options.getString("giveawayid");

                if(await giveawayModel.findOne({giveawayID: giveawayID_end})) {
                    const giveaway = await giveawayModel.findOne({giveawayID: giveawayID_end});

                    const giveaway_winner_id = giveaway.pool[Math.floor(Math.random() * giveaway.pool.length)];
                    const giveaway_winner = interaction.guild.members.cache.get(giveaway_winner_id).user;

                    const newEmbed = new Discord.EmbedBuilder()
		                .setColor(colour.server)
		                .setTitle(`:tada: Giveaway Ended :tada:`)
                        .setDescription(`A winner has been selected from the giveaway pool! :gift:`)
                        .addFields(
                            {name: "Prize", value: giveaway.prize},
                            {name: "Winner", value: `${giveaway_winner}`}
                        )
                        .setFooter({text: `Giveaway ID: ${giveawayID_end}`})
                    interaction.reply({content: "Giveaway Ended.", flags: MessageFlags.Ephemeral});
                    interaction.guild.channels.cache.get("1043332883089215579").send({embeds: [newEmbed]});

                    await giveawayModel.findOneAndDelete({giveawayID: giveawayID_end});
                } else {
                    return interaction.reply({content: "Error: Invalid giveaway ID"});
                }
                break;
            case "join":

                const giveawayID_join = interaction.options.getString("giveawayid");

                if(await giveawayModel.findOne({giveawayID: giveawayID_join})) {
                    await giveawayModel.findOneAndUpdate(
                     {giveawayID: giveawayID_join},
                     {$push: {pool: interaction.user.id}}   
                    )

                interaction.reply({content: "Joined Giveaway"});
                } else {
                    return interaction.reply({content: "Error: Invalid giveaway ID"});
                }
                break;
            case "leave":
                const giveawayID_leave = interaction.options.getString("giveawayid");

                if(await giveawayModel.findOne({giveawayID: giveawayID_leave})) {
                    await giveawayModel.findOneAndUpdate(
                     {giveawayID: giveawayID_leave},
                     {$pull: {pool: interaction.user.id}}   
                    )

                interaction.reply({content: "Left Giveaway"});
                } else {
                    return interaction.reply({content: "Error: Invalid giveaway ID"});
                }
                break;
        }

    //     if(!args[0]) return message.channel.send({content: 'You need to include either start, end, enter or leave!'});

    //     if(args[0].toUpperCase() == 'START') {

    //         if(perm >= 2) {
    //         if(giveawayActive == true) return message.channel.send({content: 'There is already an active giveaway!'});
    //         if(!args[1]) return message.channel.send({content: 'You need to include a prize!'});
    //         giveawayPool = [];
    //         giveawayActive = true;
    //         giveawayPrize = args.slice(1).join(' ');

    //         const newEmbed = new Discord.EmbedBuilder()
	// 	    .setColor(colour.server)
	// 	    .setTitle(':tada: New Giveaway! :tada:')
    //         .setDescription(`Use -giveaway join/leave to join or leave the giveaway!`)
    //         .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
    //         .addFields(
    //             {name: 'Prize', value: giveawayPrize},
    //         )

    //         message.channel.send({embeds: [newEmbed], content: '<@&820411772917645372>'});
    //         message.delete();
    //         } else return message.channel.send({content: `You don't have permission to do that!`});

    //     } else if(args[0].toUpperCase() == 'END') {

    //         if(perm >= 2) {
    //         if(giveawayActive == false) return message.channel.send({content: `There isn't a giveaway currently running!`});
    //         if(!giveawayPool[0]) return message.channel.send({content: `There isn't anyone in this giveaway!`});

    //         let giveawayWinnerData = Math.floor(Math.random() * giveawayPool.length);
    //         giveawayWinnerData = giveawayPool[giveawayWinnerData];

    //         const newEmbed = new Discord.EmbedBuilder()
	// 	    .setColor(colour.server)
	// 	    .setTitle(':tada: Giveaway Results! :tada:')
    //         .addFields(
    //             {name: 'Winner', value: `<@${giveawayWinnerData}>`},
    //             {name: 'Prize', value: `${giveawayPrize}`}
    //         )
    //         message.channel.send({embeds: [newEmbed], content: `<@${giveawayWinnerData}>`});
    //         message.delete();
    //         giveawayPool = [];
    //         giveawayActive = false;
    //         giveawayPrize;
    //         } else return message.channel.send({content: `You don't have permission to do that!`});

    //     } else if(args[0].toUpperCase() == 'JOIN') {

    //         if(giveawayActive == false) return message.channel.send({content: `There isn't a giveaway currently running!`});

    //         if(giveawayPool.includes(message.author.id)) return message.channel.send({content: 'You are already in the giveaway!'});
    //         giveawayPool.push(message.author.id);
    //         message.channel.send({content: 'You have entered the giveaway! :tada:'});

    //     } else if (args[0].toUpperCase() == 'LEAVE') {

    //         if(giveawayActive == false) return message.channel.send({content: `There isn't a giveaway currently running!`});

    //         if(!giveawayPool.includes(message.author.id)) return message.channel.send({content: `You aren't in this giveaway!`});
    //         const index = giveawayPool.indexOf(message.author.id);
    //         giveawayPool.splice(index, 1);
    //         message.channel.send({content: 'You have left the giveaway!'});
            
    //     } else return message.channel.send({content: `That's not a valid giveaway command!`});

	// 	console.log('Giveaway command was executed');
	}
}