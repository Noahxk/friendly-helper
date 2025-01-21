toolToPush = {
    type: "function",
    function: {
        name: "change_user_permission_level",
        description: "This will change the permission level of a user. You must provide the user's account ID and the new permission level. Use this when someone asks you to change their own permission level or to change someone else's permission level.",
        parameters: {
            type: "object",
            properties: {
                account_id: {
                    type: "string",
                    description: "The discord account's ID. An 18 digit number."
                },
                permission_level: {
                    type: "integer",
                    description: "The new permission level for the user. 1 is the lowest, 3 is the highest."
                }
            },
            required: ["account_id", "permission_level"],
            additionalProperties: false,
        }
    }
};

async function toolFunction(message, mpd, response, client, profileModel) {

    const id = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).account_id;
    const newPermissionLevel = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).permission_level;

    if(mpd.permissionLevel >= 3) {

        const dbResponse = await profileModel.findOneAndUpdate({
            userID: id,
        }, {
            $set: {
                permissionLevel: newPermissionLevel
            }
        });

    } else {
        return "User needs a higher permission level before you can change someone's permission level.";
    }
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;