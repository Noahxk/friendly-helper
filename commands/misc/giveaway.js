const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const giveawayModel = require("../../models/giveawaySchema");
const { nanoid } = require("nanoid");
const options = require("../../options.json");

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

                    let new_giveaway_id = nanoid(6);
                    const prize = interaction.options.getString("prize");

                    if(await giveawayModel.findOne({giveawayID: new_giveaway_id})) {
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
                    interaction.guild.channels.cache.get(options.channels.giveaway).send({embeds: [newEmbed]});

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
                    interaction.guild.channels.cache.get(options.channels.giveaway).send({embeds: [newEmbed]});

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
	}
}