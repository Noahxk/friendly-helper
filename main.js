import chalk from "chalk";
console.log(chalk.blue("System"), chalk.white(">>"), chalk.green("Importing Dependencies.."));

// Import loads of stuff because its needed apparently
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers], partials: [Partials.Channel] });
const mongoose = require('mongoose');
const OpenAI = require("openai");

// Create discord collections for commands and events
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

console.log(chalk.blue("System", chalk.white(">>"), chalk.green("Booting...")));
console.log("");

// Startup the command, event and assistant handlers
await ['command_handler', 'event_handler', 'assistant_handler'].forEach(async handler => {
	try {
		await require(`./handlers/${handler}`)(client, Discord, OpenAI);
		console.log(chalk.blue("System"), chalk.magenta(handler), chalk.white(">>"), chalk.green("Loaded with 0 errors"));
	} catch (err) {
		console.log(chalk.blue("System"), chalk.magenta(handler), chalk.white(">>"), chalk.red("Loaded with 1 or more errors"));
	}
})

console.log("");
console.log(chalk.blue("Dependancy"), chalk.yellow("MongoDB Connection"), chalk.white(">>"), chalk.green("Establishing..."));

// Establish a connection to the MongoDB database
mongoose.set('strictQuery', true);
await mongoose.connect(process.env.MONGODB_SRV).then(() => {
	console.log(chalk.blue("Dependancy"), chalk.yellow("MongoDB Connection"), chalk.white(">>"), chalk.green("Connected"));
}).catch((err) => {
	console.log(chalk.blue("Dependancy"), chalk.yellow("MongoDB Connection"), chalk.white(">>"), chalk.red("Could not connect"));
});

console.log("");
console.log(chalk.blue("System"), chalk.cyan("Client"), chalk.white(">>"), chalk.green("Logging in..."));

// Log the bot client into the discord servers

await client.login(process.env.DEV_BOT_TOKEN).then(() => {
	console.log(chalk.blue("System"), chalk.cyan("Client"), chalk.white(">>"), chalk.green("Client logged in"));
	console.log(chalk.blue("System"), chalk.white(">>"), chalk.green("Online"));
}).catch((err) => {
	console.log(chalk.blue("System"), chalk.cyan("Client"), chalk.white(">>"), chalk.red("Could not loggin"));
});
