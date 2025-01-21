const { ActivityType } = require("discord.js");

toolToPush = {
    type: "function",
    function: {
        name: "change_bot_activity",
        description: "This will change your displayed activity on discord. You must specify the type of activity and the custom activity message. Use this when someone asks you to change your activity or when you want to change it to mock someone.",
        parameters: {
            type: "object",
            properties: {
                activity_type: {
                    type: 'string',
                    description: "The type of activity you want to display. Can be 'WATCHING', 'PLAYING' or 'LISTENING TO'."
                },
                activity_message: {
                    type: 'string',
                    description: "The custom message you want to display after the activity type. E.g. 'you sleep' with the activity type 'WATCHING' would display 'Watching you sleep'."
                }
            },
            required: ["activity_type", "activity_message"],
            additionalProperties: false,
        }
    }
};

function toolFunction(message, msgProfileData, response, client) {
    let activityType = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).activity_type;
    const activityMessage = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).activity_message;

    switch(activityType.toUpperCase()) {
        case "WATCHING":
            activityType = ActivityType.Watching;
            break;
        case "PLAYING":
            activityType = ActivityType.Playing;
            break;
        case "LISTENING TO":
            activityType = ActivityType.Listening;
            break;
        default:
            activityType = ActivityType.Watching;
            break;
    }

    client.user.setPresence({
        activities: [{ name: activityMessage, type: activityType }],
        status: 'online',
      });
    return "Activity changed.";
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;