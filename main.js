import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers], partials: [Partials.Channel] });
const mongoose = require('mongoose');
const OpenAI = require("openai");

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler', 'assistant_handler'].forEach(handler => {
	require(`./handlers/${handler}`)(client, Discord, OpenAI);
})

mongoose.connect(process.env.MONGODB_SRV).then(() => {
	console.log('MongoDB connected!');
}).catch((err) => {
	throw err;
});

client.login(process.env.DEV_BOT_TOKEN).catch(err => {
	console.log(err);
});
