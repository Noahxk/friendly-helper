const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const axios = require("axios");
const { nanoid } = require("nanoid");
module.exports = {
    data: new SlashCommandBuilder()
            .setName("tod")
            .setDescription("Truth or Dare"),
    async execute(interaction, Discord, client, fetch, perm) {

        const game_id = nanoid(6);

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Select an option')
        .setDescription("Use a button to start a game of your choosing!")
        .setFooter({text: `Game ID: ${game_id}`})

        const button_rows = {
            initial_row: new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`truth ${game_id}`)
                        .setLabel("Truth")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(`dare ${game_id}`)
                        .setLabel("Dare")
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(`paranoia ${game_id}`)
                        .setLabel("Paranoia")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`nhie ${game_id}`)
                        .setLabel("NHIE")
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(`wyr ${game_id}`)
                        .setLabel("WYR")
                        .setStyle(ButtonStyle.Success)
                ),
            paranoia: new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`paranoia ${game_id}`)
                        .setLabel("Paranoia")
                        .setStyle(ButtonStyle.Secondary)
                ),
            nhie: new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`nhie ${game_id}`)
                        .setLabel("NHIE")
                        .setStyle(ButtonStyle.Danger)
                ),
            wyr: new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`wyr ${game_id}`)
                        .setLabel("WYR")
                        .setStyle(ButtonStyle.Success)
                ),
            tod: new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`truth ${game_id}`)
                        .setLabel("Truth")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(`dare ${game_id}`)
                        .setLabel("Dare")
                        .setStyle(ButtonStyle.Danger),
                ),
        };

        const button_map = new Map();
        button_map.set("paranoia", button_rows.paranoia);
        button_map.set("nhie", button_rows.nhie);
        button_map.set("wyr", button_rows.wyr);
        button_map.set("truth", button_rows.tod);
        button_map.set("dare", button_rows.tod);

        interaction.reply({embeds: [newEmbed], components: [button_rows.initial_row]});

        const gamemode_selector_collector = interaction.channel.createMessageComponentCollector({ time: 120000 });

        gamemode_selector_collector.on("collect", async collector_interaction => {
            if(collector_interaction.customId.split(" ")[1] != game_id) return;
            collector_interaction.deferUpdate();

            const question_id = collector_interaction.customId.split(" ")[0];
            const question = await fetchQuestion(question_id);
            
            let question_type;
            switch(question_id) {
                case "truth":
                    question_type = "Truth";
                    break;
                case "dare":
                    question_type = "Dare";
                    break;
                case "paranoia":
                    question_type = "Paranoia";
                    break;
                case "nhie":
                    question_type = "Never Have I Ever";
                    break;
                case "wyr":
                    question_type = "Would You Rather?";
                    break;
            }

            const questionEmbed = new Discord.EmbedBuilder()
                    .setColor(colour.default)
                    .setTitle(question_type)
                    .setDescription(question.question)
                    .setFooter({text: `Game ID: ${game_id}`})
                    .setAuthor({ name: "Requested by " + collector_interaction.user.displayName, iconURL: collector_interaction.user.displayAvatarURL()})

            await interaction.followUp({embeds: [questionEmbed], components: [button_map.get(question_id)]});

            gamemode_selector_collector.resetTimer();
            });

        const tod_api_endpoint = "https://api.truthordarebot.xyz/v1/";

        async function fetchQuestion(type) {
            const res = await axios.get(tod_api_endpoint + type, 10000);
            return await res.data;
        }
    }
}