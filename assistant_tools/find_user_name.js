const { Client } = require("discord.js");

toolToPush = {
    type: "function",
    function: {
        name: "find_user_name",
        description: "This will get you the name of a user, you must provide the user's account ID. Use this when someone asks for their own name, someone else's name or when you need to address a user with their name.",
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

function toolFunction(message, msgProfileData, response, client) {
    try{
        const arguments = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments)
        const user = client.users.cache.get(arguments.account_id);
        return user.username;
    } catch (err){
        console.error(err);
        return undefined;
    }
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;