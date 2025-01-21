toolToPush = {
    type: "function",
    function: {
        name: "change_user_theme",
        description: "This will change the user's theme colour that is used for most embeds. You must provide the user's account ID, the new theme colour and whether they want to change their own colour or someone else's. Use this when someone asks you to change their own theme colour or someone elses.",
        parameters: {
            type: "object",
            properties: {
                account_id: {
                    type: "string",
                    description: "The discord account's ID. An 18 digit number."
                },
                theme_colour: {
                    type: "string",
                    description: "The new theme colour for the user. A hex colour code."
                },
                personal: {
                    type: "boolean",
                    description: "Whether the user wants to change their own theme colour or someone else's. True for their own, false for someone else's."
                }
            },
            required: ["account_id", "theme_colour", "personal"],
            additionalProperties: false,
        }
    }
};

async function toolFunction(message, mpd, response, client, profileModel) {

    const id = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).account_id;
    const newThemeColour = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).theme_colour;
    const personal = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).personal;

    try {
    if(personal == true) {

        const dbResponse = await profileModel.findOneAndUpdate({
            userID: id,
        }, {
            $set: {
                theme: newThemeColour
            }
        });
        return "Successfully changed user's theme colour.";

    } else if(personal == false && mpd.permissionLevel >= 2){
        
        const dbResponse = await profileModel.findOneAndUpdate({
            userID: id,
        }, {
            $set: {
                theme: newThemeColour
            }
        });
        return "Successfully changed user's theme colour.";

    } else {
        return "User needs a higher permission level before you can change someone elses theme colour.";
    }
    } catch (err) {
        console.error(err);
        return undefined;
    }
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;