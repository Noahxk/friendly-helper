const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("shop")
            .setDescription("Access the shop")
            .addSubcommand(subcommand =>
                subcommand
                    .setName("buy")
                    .setDescription("Lets you buy something from the shop")
                    .addStringOption(option =>
                        option
                            .setName("item")
                            .setDescription("Item to buy from the shop")
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName("view")
                    .setDescription("View the shop inventory")
            ),
	async execute(interaction, Discord, client, fetch, perm) {

        let profileData;
		try {
			profileData = await profileModel.findOne({userID: interaction.user.id});
			}
		catch (err) {
			console.log(err);
		}

        const avaliable_items = [
            {
                id: "police radio",
                display_name: "Police Radio",
                description: "A permanent object that gives you a 50% chance of halving the fine when you fail a robbery.",
                price: 2000,
                type: "item"
            },
            {
                id: "padlock",
                display_name: "Padlock",
                description: "A one time use item that prevents you from being robbed.",
                price: 200,
                type: "item"
            },
            {
                id: "black hole",
                display_name: "Black Hole",
                roleID: "1064413042491785306",
                price: 4000,
                type: "cosmetic"
            },
            {
                id: "prismatic",
                display_name: "Prismatic",
                roleID: "1064412486931058729",
                price: 4000,
                type: "cosmetic"
            },
            {
                id: "lunar",
                display_name: "Lunar",
                roleID: "1064414523802525807",
                price: 4000,
                type: "cosmetic"
            },
            {
                id: "solar",
                display_name: "Solar",
                roleID: "1064414464230830162",
                price: 4000,
                type: "cosmetic"
            },
            {
                id: "cosmic",
                display_name: "Cosmic",
                roleID: "1064416287930994760",
                price: 4000,
                type: "cosmetic"
            },
            {
                id: "demonic",
                display_name: "Demonic",
                roleID: "1065519733086093332",
                price: 4000,
                type: "cosmetic"
            },
            {
                id: "angelic",
                display_name: "Angelic",
                roleID: "1065519448351572028",
                price: 4000,
                type: "cosmetic"
            },
            {
                id: "vortex",
                display_name: "Vortex",
                roleID: "1064412888288211024",
                price: 4000,
                type: "cosmetic"
            },
            {
                id: "vibrant",
                display_name: "Vibrant",
                roleID: "1064412548214046730",
                price: 4000,
                type: "cosmetic"
            },
        ];

        const shop_inventory = new Map();
        avaliable_items.forEach(item =>{
            shop_inventory.set(item.id, item);
        });

        if(interaction.options.getSubcommand() == "buy") {

            let item_to_buy = interaction.options.getString("item");

            if(shop_inventory.get(item_to_buy)) {
                item_to_buy = shop_inventory.get(item_to_buy);
            } else return interaction.reply({content: "Invalid item: Does not exist"});

            if(profileData.coins - item_to_buy.price < 0) return interaction.reply({content: "You do not have enough money to buy that item."});
            if(item_to_buy.type == "item") {
                if(profileData.inventory.some(item => item.id == item_to_buy.id)) {
                    return interaction.reply({content: "You already have one of these in your inventory."});
                } else {
                    const response = await profileModel.findOneAndUpdate({
                        userID: interaction.user.id,
                    }, {
                        $push: {
                            inventory: item_to_buy
                        }
                    });

                    const response2 = await profileModel.findOneAndUpdate({
                        userID: interaction.user.id,
                    }, {
                        $inc: {
                            coins: -item_to_buy.price
                        }
                    });
                    console.log(profileData.inventory.includes(item_to_buy.display_name))
                } 
            } else if(item_to_buy.type == "cosmetic") {
                if(profileData.cosmetics.some(cosmetic => cosmetic.id == item_to_buy.id)) {
                    return interaction.reply({content: "You already have this cosmetic."});
                } else {
                    const response = await profileModel.findOneAndUpdate({
                        userID: interaction.user.id,
                    }, {
                        $push: {
                            cosmetics: item_to_buy
                        }
                    });

                    const response2 = await profileModel.findOneAndUpdate({
                        userID: interaction.user.id,
                    }, {
                        $inc: {
                            coins: -item_to_buy.price
                        }
                    });
                }
            }

            const newEmbed = new Discord.EmbedBuilder()
                .setColor(colour.default)
                .setTitle("Item Bought")
                .addFields(
                    {name: "Bought Item", value: item_to_buy.display_name},
                    {name: "Price", value: `${item_to_buy.price} :coin:`}
                )
            interaction.reply({embeds: [newEmbed]});

        } else if(interaction.options.getSubcommand() == "view") {
            newEmbed = new Discord.EmbedBuilder()
            .setColor(colour.default)
            .setTitle('Shop')
            .setDescription('To buy an item, use: /shop buy (item)')
            
            let fieldText = [];

            avaliable_items.forEach(item =>{
                if(item.type == "item") {

                // if item type
                newEmbed.addFields(
                    {name: `__${item.display_name}__`, value: `
                        **Description:** ${item.description}
                        **Price:** ${item.price} :coin:
                    `});

            } else if(item.type == "cosmetic") {

                // if cosmetic type
                fieldText.push(`**${item.display_name}** - <&${item.roleID}>`)

            }
            });

            newEmbed.addFields({name: "__Cosmetics__", value: fieldText.join("\n")})
            interaction.reply({embeds: [newEmbed]});
        }
        console.log(`${interaction.user.username} used ${interaction.commandName}`);
    }
}