const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const profileModelFetcher = require("../../models/fetchers/profileModelFetcher");

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

        const profileData = await profileModelFetcher.fetch(interaction.user.id);

        const shop_inventory = new Map();
        const shop_inventory_array = [];

        const item_type_folders = fs.readdirSync("resources/shop");
        item_type_folders.forEach(folder => {
            const item_json_files = fs.readdirSync(`resources/shop/${folder}/json`).filter(file => file.endsWith(".json"));
            item_json_files.forEach(file => {
                const file_object = require(`../../resources/shop/${folder}/json/${file}`);
                if(file_object.unlisted == true) return;
                shop_inventory.set(file_object.id, file_object);
                shop_inventory_array.push(file_object);
            });
        });

        function create_inventory_object(item) {
            const obj = {
                id: item.id,
                display_name: item.display_name,
                type: item.type
            }
            if(item.type == "cosmetic") obj.roleID = item.roleID;
            if(item.type == "redeemable") {
                obj.function_file = item.function_file;
                obj.uses = item.uses;
            }
            return obj;
        }

        if(interaction.options.getSubcommand() == "buy") {

            let item_to_buy = interaction.options.getString("item");
            item_to_buy = item_to_buy.toLowerCase().replace(" ", "_");
            console.log(item_to_buy);

            if(shop_inventory.get(item_to_buy)) {
                item_to_buy = shop_inventory.get(item_to_buy);
            } else return interaction.reply({content: "Invalid item: Does not exist"});

            if(profileData.coins - item_to_buy.price < 0) return interaction.reply({content: "You do not have enough money to buy that item."});

            if(item_to_buy.type == "item" || item_to_buy.type == "redeemable") {

                if(profileData.inventory.some(item => item.id == item_to_buy.id)) {
                    return interaction.reply({content: "Error: You can only own one of this."});
                } else {
                    const response = await profileModel.findOneAndUpdate({
                        userID: interaction.user.id,
                    }, {
                        $push: {
                            inventory: create_inventory_object(item_to_buy)
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
            } else if(item_to_buy.type == "cosmetic") {

                if(profileData.cosmetics.some(cosmetic => cosmetic.id == item_to_buy.id)) {
                    return interaction.reply({content: "Error: You can only own one of this."});
                } else {

                    const response = await profileModel.findOneAndUpdate({
                        userID: interaction.user.id,
                    }, {
                        $push: {
                            cosmetics: create_inventory_object(item_to_buy)
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

            shop_inventory_array.forEach(item =>{
                if(item.type == "item" || item.type == "redeemable") {

                // if item or redeemable type
                newEmbed.addFields(
                    {name: `__${item.display_name}__`, value: `
                        **Description:** ${item.description}
                        **Price:** ${item.price} :coin:
                    `});

                } else if(item.type == "cosmetic") {

                // if cosmetic type
                    fieldText.push(`**${item.display_name}** - <@&${item.roleID}>`)

                }
            });

            newEmbed.addFields({name: "__Cosmetics__", value: fieldText.join("\n")})
            interaction.reply({embeds: [newEmbed]});
        }
    }
}