toolToPush = {
    type: "function",
    function: {
        name: "double_or_nothing_gambling_game",
        description: "This is a gambling game that allows the user to double a specified amount of money or lose it all. You must specify the amount of money they are gambling. Only use this when someone specifically asks to do double or nothing, don for short. The user must ask for don.",
        parameters: {
            type: "object",
            properties: {
                amount: {
                    type: 'integer',
                    description: "The amount of money the user is gambling. Cannot be 0 or a negative number."
                }
            },
            required: ["amount"],
            additionalProperties: false,
        }
    }
};

async function toolFunction(message, msgProfileData, response, client, profileModel) {

    let amountToGamble = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).amount;

        if(msgProfileData.coins - amountToGamble < 0) return "User doesn't have enough money.";

        const donData = Math.floor(Math.random() * 2);
        if(donData == 0){

            amountToGamble *= 1;

            const response2 = await profileModel.findOneAndUpdate({
				userID: message.author.id,
			}, {
				$inc: {
					coins: amountToGamble
				}
			});
            return "User won. Their bet has been doubled and added to their balance.";
        } else {
            const response2 = await profileModel.findOneAndUpdate({
				userID: message.author.id,
			}, {
				$inc: {
					coins: -amountToGamble
				}
			});
            return "User lost. Their bet has been removed from their balance.";
        }
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;