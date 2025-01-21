toolToPush = {
    type: "function",
    function: {
        name: "find_user_avatar",
        description: "This will get you the avatar URL of a user, you must provide the user's account ID. Use this when someone asks for their own avatar/profile picture or someone else's avatar/profile picture.",
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
        const user = client.users.cache.get(id);
        return user.displayAvatarURL(); 
    } catch (err) {
        console.log(err);
        return undefined;
    }
    
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;