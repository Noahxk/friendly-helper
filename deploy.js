const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const commands = [];

const command_folders = fs.readdirSync("commands");

for(const folder of command_folders) {
	const commandFiles = fs.readdirSync(`commands/${folder}`).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at path: commands/${folder}/${file} is missing a required "data" or "execute" property.`);
		}
	}
}



const rest = new REST().setToken(process.env.DEV_BOT_TOKEN);

// client, guild
// (async () => {
// 	try {
// 		console.log(`Started refreshing ${commands.length} application (/) commands.`);

// 		const data = await rest.put(
// 			Routes.applicationGuildCommands("925622238378606593", "811823088605724672"),
// 			{ body: commands },
// 		);

// 		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
// 	} catch (error) {
// 		console.error(error);
// 	}
// })();

// client, guild, command
// rest.delete(Routes.applicationGuildCommand("925622238378606593", "811823088605724672", '1333221294195347495'))
// 	.then(() => console.log('Successfully deleted guild command'))
// 	.catch(console.error);