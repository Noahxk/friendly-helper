const profileModel = require('../../models/profileSchema');

module.exports= {
	name: 'don',
	description: 'Either doubles the amount gambled or you lose it',
	async execute(message, args, Discord, client, fetch){

		let profileData;
		try {
			profileData = await profileModel.findOne({userID: message.author.id});
			if(!profileData) {
				let profile = await profileModel.create({
					userID: message.member.id,
					username: message.author.username,
					coins: 100,
					inventory: [],
					theme: '#dafffd',
					cosmetics: [],
					marriedTo: 'Not Married',
                    permissionLevel: 1
				})
                return message.channel.send({content: 'Creating your profile, please try again!'});
			}
		}
		catch (err) {
			console.log(err);
		}

        if(!args[0]) return message.channel.send({content: 'You need to include an amount to gamble.'});
        if(isNaN(args[0])) return message.channel.send({content: 'How do you go about gambling that?'});
		if(args[0] <= 0) return message.channel.send({content: `You can't exactly gamble nothing.`});
        let gambledMoney = parseInt(args[0]);
        if(profileData.coins - gambledMoney < 0) return message.channel.send({content: `You don't have enough money to do that.`});

        const donData = Math.floor(Math.random() * 2);
        if(donData == 0){
            donResult = ':moneybag: Doubled! :moneybag:';

			gambledMoney *= 1;

            const response2 = await profileModel.findOneAndUpdate({
				userID: message.author.id,
			}, {
				$inc: {
					coins: gambledMoney
				}
			});
            amountWon = gambledMoney;
        } else {
            donResult = ':x: Nothing :x:';
            const response2 = await profileModel.findOneAndUpdate({
				userID: message.author.id,
			}, {
				$inc: {
					coins: -gambledMoney
				}
			});
            amountWon = gambledMoney * -1;
        }

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Double or Nothing Results')
        .addFields(
            {name: 'Result', value: donResult},
            {name: 'Amount Won', value: `${amountWon} :coin:`}
        )
		
		message.channel.send({embeds: [newEmbed]});
		console.log('Double or Nothing command was executed');
	}
}