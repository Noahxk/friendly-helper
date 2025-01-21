const { Client } = require("discord.js");

toolToPush = {
    type: "function",
    function: {
        name: "find_user_theme",
        description: "This will get you the theme colour of a user, you must provide the user's account ID. Use this when someone asks for their own theme colour or someone else's theme colour.",
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

    try{
        msgProfileData = await profileModel.findOne({userID: id});
        return msgProfileData.theme
    } catch (err){
        console.error(err);
        return undefined;
    }
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;