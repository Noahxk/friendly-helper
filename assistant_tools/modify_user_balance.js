const profileModelFetcher = require('../models/fetchers/profileModelFetcher');

toolToPush = {
    type: "function",
    function: {
        name: "modify_user_balance",
        description: "This will modify the balance of a user in a way that you specify, you must also specify the user's account ID and the amount to modify the balance by. Use this when someone asks you to modify their balance or someone else's balance.",
        parameters: {
            type: "object",
            properties: {
                account_id: {
                    type: "string",
                    description: "The discord account's ID. An 18 digit number."
                },
                modification_type: {
                    type: "string",
                    description: "The way you want to modify the user's balance. Can be add, subtract or set."
                },
                amount: {
                    type: "integer",
                    description: "The amount you want to modify the user's balance by."
                }
            },
            required: ["account_id", "modification_type"],
            additionalProperties: false,
        }
    }
};

async function toolFunction(message, mpd, response, client, profileModel) {

    const id = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).account_id;
    const modificationType = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).modification_type;
    const amount = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).amount;

    if(mpd.permissionLevel >= 3) {

        const msgProfileData = profileModelFetcher.fetch(id);

        switch(modificationType) {
            case "add":
                dbResponse = await profileModel.findOneAndUpdate({
                    userID: id,
                }, {
                    $inc: {
                        coins: amount
                    }
                });
                return "Added amount to user's balance.";
            case "subtract":
                dbResponse = await profileModel.findOneAndUpdate({
                    userID: id,
                }, {
                    $inc: {
                        coins: -amount
                    }
                });
                return "Removed amount from user's balance.";
            case "set":
                dbResponse = await profileModel.findOneAndUpdate({
                    userID: id,
                }, {
                    $set: {
                        coins: amount
                    }
                });
                return "Set user's balance to amount.";
        }
        

    } else {
        return "User needs a higher permission level before you can modify a balance.";
    }
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;