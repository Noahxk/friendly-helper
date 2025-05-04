const { MessageFlags } = require("discord.js");
const profileModel = require('../../models/profileSchema');
const profileModelFetcher = require('../../models/fetchers/profileModelManager');
const fetch = require('node-fetch');
const cooldowns = new Map();

module.exports = async (Discord, client, interaction) => {

    if (!interaction.isChatInputCommand()) return;

    const msgProfileData = await profileModelFetcher.fetch(interaction.user.id);

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	if(!cooldowns.has(command.data.name)){
        cooldowns.set(command.data.name, new Discord.Collection());
    } 

    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.data.name);
    const cooldown_amount = (command.cooldown) * 1000;

    if(time_stamps.has(interaction.user.id)){
        const expiration_time = time_stamps.get(interaction.user.id) + cooldown_amount;

        if(current_time < expiration_time){
            const time_left = (expiration_time - current_time) / 1000;

			if(time_left > 1) return interaction.reply({content: `You have ${time_left.toFixed(1)} seconds left until you can use this command again!`});
        }
    }
    
    time_stamps.set(interaction.user.id, current_time);

    colour = {
        default: msgProfileData.theme,
        server: "dafffd",
        admin: "ff0008",
        debug: "000000"
    };

    const perm = msgProfileData.permissionLevel;

	try {
		await command.execute(interaction, Discord, client, fetch, perm);
        console.log(`${interaction.user.id} ${interaction.user.username} : ${interaction.commandName}`);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
};
