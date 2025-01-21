toolToPush = {
    type: "function",
    function: {
        name: "ban_user",
        description: "This will ban a user from the discord server. You must provide the user's account ID. Use this when someone asks you to ban someone else, they cannot request to ban themself.",
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

    if(mpd.permissionLevel >= 2) {
        try{
            msgProfileData = await profileModel.findOne({userID: id});

            try{
                message.guild.members.ban(id, `Banned by The Friend Group Assistant on request by ${message.author.id}`);
                return "You successfully banned the user.";
            } catch(err) {
                console.error(err);
                return "You couldn't ban the user.";
            }
            
        } catch(err) {
            console.error(err);
            return undefined;
        }

    } else {
        return "User needs a higher permission level before you can ban someone.";
    }
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;