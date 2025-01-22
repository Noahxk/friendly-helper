const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("equip")
            .setDescription("Used to equip a cosmetic role")
            .addStringOption(option =>
                option
                    .setName("cosmetic")
                    .setDescription("The cosmetic you want to equip")
                    .setRequired(true)
            ),
	async execute(interaction, Discord, client, fetch, perm) {

        let profileData;
		try {
			profileData = await profileModel.findOne({userID: interaction.user.id});
		}
		catch (err) {
			console.log(err);
		}

        const owned_cosmetics = new Map();

        profileData.cosmetics.forEach(cosmetic => {
            owned_cosmetics.set(cosmetic.id, cosmetic.roleID);
        });

        const cosmetic_to_equip = interaction.options.getString("cosmetic").toLowerCase();

        if(!owned_cosmetics.get(cosmetic_to_equip)) return interaction.reply("Invalid cosmetic: You do not own this cosmetic.");

        profileData.cosmetics.forEach(cosmetic => {
            if(interaction.member.roles.cache.has(cosmetic.roleID)) interaction.member.roles.remove(cosmetic.roleID);
        });

        interaction.member.roles.add(owned_cosmetics.get(cosmetic_to_equip));

        const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Cosmetic Eqipped')
        .setDescription(`You equipped <@&${owned_cosmetics.get(cosmetic_to_equip)}>`)
        interaction.reply({embeds: [newEmbed]});

		console.log(`${interaction.user.username} used ${interaction.commandName}`);
	}
}