const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');

module.exports= {
    
    data: new SlashCommandBuilder()
            .setName("fish")
            .setDescription("Fish for items to sell. (Free Money)"),
    cooldown: 30,
	async execute(interaction, Discord, client, fetch, perm) {

        const findable_items = {
            common: [
                {name: "Dirt", price: 10},
                {name: "Scrap", price: 20},
                {name: "Fabric", price: 15},
                {name: "Common Chest", price: 23},
            ],
            uncommon: [
                {name: "Uncommon Chest", price: 76},
                {name: "Deck of Cards", price: 54},
            ],
            rare: [
                {name: "Rare Chest", price: 168},
                {name: "Crystals", price: 160},
                {name: "Piece of Gold", price: 200},
                {name: "One of Rhys' Incognito Tabs", price: 173},
            ],
            epic: [
                {name: "Epic Chest", price: 298},
                {name: "Sam's Chair", price: 192},
                {name: "Violet's Glittery Hairspray", price: 202},
                {name: "Sacred Pickle Jar", price: 320},
            ],
            legendary: [
                {name: "Legendary Chest", price: 445},
                {name: "Atlantis", price: 1025},
                {name: "Bicycle", price: 398},
                {name: "Ricky's Bra", price: 1001},
            ]
        };

        interaction.reply({content: 'You started fishing, you will be notified when you find something.'});
        setTimeout(getObject, Math.floor(Math.random() * (30 - 15 + 1) + 15) * 1000);
        
        async function getObject() {

        const found_object_rarity = Math.floor(Math.random() * 15);
        let found_object_class;
        
        switch(true) {
            case found_object_rarity <= 4:
                found_object_class = findable_items.common;
                break;
            case (found_object_rarity <= 8):
                found_object_class = findable_items.uncommon;
                break;
            case (found_object_rarity <= 11):
                found_object_class = findable_items.rare;
                break;
            case (found_object_rarity <= 13):
                found_object_class = findable_items.epic;
                break;
            case (found_object_rarity == 14):
                found_object_class = findable_items.legendary;
                break;
            default:
                console.log('error');
                break;
        }

        const found_object = found_object_class[Math.floor(Math.random() * 2)];

        const response = await profileModel.findOneAndUpdate({
            userID: interaction.user.id,
        }, {
            $inc: {
                coins: found_object.price
            }
        });

		const newEmbed = new Discord.EmbedBuilder()
		.setColor(colour.default)
		.setTitle(`${interaction.user.username}'s Fishing Results`)
        .setDescription(`Automatically Sold Item`)
        .addFields(
            {name: 'Treasure:', value: found_object.name},
            {name: 'Sold For:', value: `${found_object.price} :coin:`}
        )
		
		interaction.followUp({embeds: [newEmbed]});
		console.log(`${interaction.user.username} used ${interaction.commandName}`);
        }
	}
}