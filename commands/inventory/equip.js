const profileModel = require('../../models/profileSchema');

module.exports= {
	name: 'equip',
	description: 'Used to equip cosmetic roles',
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
            return message.channel.send({content: `Creating your profile, please try again!`});
			}
		}
		catch (err) {
			console.log(err);
		}

        const cosmeticRoles = [
            {
                name: 'Black Hole',
                id: '1064413042491785306'
            },
            {
                name: 'Prismatic',
                id: '1064412486931058729'
            },
            {
                name: 'Lunar',
                id: '1064414523802525807'
            },
            {
                name: 'Solar',
                id: '1064414464230830162'
            },
            {
                name: 'Cosmic',
                id: '1064416287930994760'
            },
            {
                name: 'Demonic',
                id: '1065519733086093332'
            },
            {
                name: 'Angelic',
                id: '1065519448351572028'
            },
            {
                name: 'Vortex',
                id: '1064412888288211024'
            },
            {
                name: 'Vibrant',
                id: '1064412548214046730'
            }
        ];

        let equippedRole;

        if(!profileData.cosmetics.includes(args.join(' ').toUpperCase())) return message.channel.send({content: `You don't own that cosmetic!`});

        cosmeticRoles.forEach(role => {
            
            if(message.member.roles.cache.has(role.id)) {
                    message.member.roles.remove(role.id);
            }
            if(args.join(' ').toUpperCase() == role.name.toUpperCase()) {
                message.member.roles.add(role.id);
                equippedRole = role.name;
            }
        });

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle('Role Equipped')
        .setDescription(`You equipped the **${equippedRole}** cosmetic!`)
		
		message.channel.send({embeds: [newEmbed]});
		console.log('Equip command was executed');
	}
}