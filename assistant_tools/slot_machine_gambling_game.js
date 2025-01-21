toolToPush = {
    type: "function",
    function: {
        name: "slot_machine_gambling_game",
        description: "This is a gambling game that allows the user to gamble a specified amount of money on a slot machine. You must specify the amount of money they are gambling. Only use this when someone specifically asks to do a slot machine game or slots for short. The user must ask for slots.",
        parameters: {
            type: "object",
            properties: {
                amount: {
                    type: "integer",
                    description: "The amount the user wants to gamble. Cannot be less than 1 or a negative number."
                },
            },
            required: ["amount"],
            additionalProperties: false,
        }
    }
};

async function toolFunction(message, msgProfileData, response, client, profileModel, Discord) {

    const amountToGamble = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).amount;

        if(msgProfileData.coins - amountToGamble < 0) return "User doesn't have enough money to gamble that amount.";

        const slotSymbols = [":watermelon:",":grapes:",":gem:",":four_leaf_clover:",":peach:",":cherries:",":bell:",":seven:",":chocolate_bar:",":apple:",    ":gem:",":lemon:",":bell:",":kiwi:",":coconut:",":lime:",":avocado:",":tomato:",":pineapple:",":melon:"];
        const symbolsPerReel = 10;

        const slot1 = slotSymbols[Math.floor(Math.random() * symbolsPerReel)];
        const slot2 = slotSymbols[Math.floor(Math.random() * symbolsPerReel)];
        const slot3 = slotSymbols[Math.floor(Math.random() * symbolsPerReel)];

        if(slot1 == slot2 && slot2 == slot3){
            amountToGamble *= 73;
            const newEmbed = new Discord.EmbedBuilder()
            .setColor(msgProfileData.theme)
            .setTitle('Dirty Slot')
            .setDescription(`
# ${slot1} | ${slot2} | ${slot3}
    
:sparkles: You Won: ${amountToGamble} :coin: :sparkles:
            `);
            try{ 
                dbResponse = await profileModel.findOneAndUpdate({
                    userID: message.author.id,
                }, {
                    $inc: {
                        coins: amountToGamble
                    }
                });
                message.channel.send({embeds: [newEmbed]});
                return "User won. Their bet has been multiplied by 40 and added to their balance.";
            } catch (err){
                console.error(err);
            }
        } else {
            const newEmbed = new Discord.EmbedBuilder()
            .setColor(msgProfileData.theme)
            .setTitle('Dirty Slot')
            .setDescription(`
# ${slot1} | ${slot2} | ${slot3}
    
You Lost: ${amountToGamble} :coin:
            `);
            try{ 
                dbResponse = await profileModel.findOneAndUpdate({
                    userID: message.author.id,
                }, {
                    $inc: {
                        coins: -amountToGamble
                    }
                });
                message.channel.send({embeds: [newEmbed]});
                return "User lost. Their bet has been removed from their balance.";
            } catch (err){
                console.error(err);
            }
        }
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;