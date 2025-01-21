module.exports = {
    name: 'avatar',
    description: `Sends the mentioned users avatar`,
    execute(message, args, Discord, client, fetch) {

        const member = message.mentions.users.first();
        if(!member) return message.channel.send('You need to mention a member!');
        const imgURL = member.displayAvatarURL();

        message.channel.send({content: imgURL});
        console.log('Avatar command was executed');
    }
}