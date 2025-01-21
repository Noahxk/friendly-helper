const profileModel = require('../../models/profileSchema');

const fetch = require('node-fetch');

const fs = require('fs');

const cooldowns = new Map();



module.exports = async (Discord, client, message) => {    

    const prefix = '-';
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    let msgProfileData;
		try {
			msgProfileData = await profileModel.findOne({userID: message.author.id});
			if(!msgProfileData) {
				let profile = await profileModel.create({
					userID: message.author.id,
					username: message.author.username,
					coins: 100,
					inventory: [],
                    theme: '#dafffd',
                    cosmetics: [],
                    marriedTo: 'Not Married',
                    permissionLevel: 1
				})
                return;
			}
		}
		catch (err) {
			console.log(err);
		}

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);

    if(!command) return;

    if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Discord.Collection());
    } 

    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.name);
    const cooldown_amount = (command.cooldown) * 1000;

    if(time_stamps.has(message.author.id)){
        const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

        if(current_time < expiration_time){
            const time_left = (expiration_time - current_time) / 1000;

            return message.channel.send(`You have ${time_left.toFixed(1)} seconds left until you can use this command again!`);
        }
    }
    
    time_stamps.set(message.author.id, current_time);

    colour = {
        default: msgProfileData.theme,
        server: '#dafffd',
        admin: '#ff0008',
        debug: '#000000',
    };

    perm = msgProfileData.permissionLevel;

    try {
        if(command) command.execute(message, args, Discord, client, fetch, perm);
    } catch (err) {
        console.log(err);
        message.channel.send('There was an error trying to execute this command!');
    }
    
}
	