const fs = require('fs');

module.exports = (client, Discord) =>{

    const command_folders = fs.readdirSync("commands");

    for(const folder of command_folders) {
        const command_files = fs.readdirSync(`commands/${folder}`).filter(file => file.endsWith('.js'));

        for(const file of command_files) {
            const command = require(`../commands/${folder}/${file}`);

            if("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command file at path: commands/${folder}/${file} is missing a required "data" or "execute" property.`);
            }
        }
    }
}