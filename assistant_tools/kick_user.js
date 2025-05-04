const profileModelFetcher = require('../models/fetchers/profileModelManager');

toolToPush = {
    type: "function",
    function: {
        name: "kick_user",
        description: "This will kick a user from the discord server. You must provide the user's account ID. Use this when someone asks you to kick someone else, they cannot request to kick themself.",
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
    const user = client.users.cache.get(id).member;

    if(mpd.permissionLevel >= 2) {
        try{
            msgProfileData = await profileModelFetcher.fetch(id);

            try{
                user.kick();
                return "You successfully kicked the user.";
            } catch(err) {
                console.error(err);
                return "You couldn't kick the user.";
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