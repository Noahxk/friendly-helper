toolToPush = {
    type: "function",
    function: {
        name: "find_user_balance",
        description: "This will get you the coin balance of a user, you must provide the user's account ID. Use this when someone asks for their own balance, someone else's balance or when you need to point out how poor someone is.",
        parameters: {
            type: "object",
            properties: {
                account_id: {
                    type: "string",
                    description: "The discord account's ID. An 18 digit number."
                },
            },
            required: ["account_id"],
            additionalProperties: false,
        }
    }
};

async function toolFunction(message, mpd, response, client, profileModel) {
    
    const id = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).account_id;

    let msgProfileData;
    try {
        msgProfileData = await profileModel.findOne({userID: id});
        return msgProfileData.coins
        }
    catch (err) {
           console.log(err);
           return undefined;
        }
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;