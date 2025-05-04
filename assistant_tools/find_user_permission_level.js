const profileModelFetcher = require("../models/fetchers/profileModelManager");

toolToPush = {
    type: "function",
    function: {
        name: "find_user_permission_level",
        description: "This will get you the permission level of a user, you must provide the user's account ID. Use this when someone asks for their own permission level, someone else's permission level or when you need to point out how powerless they are.",
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

    const msgProfileData = await profileModelFetcher.fetch(id);
    return msgProfileData.permissionLevel
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;