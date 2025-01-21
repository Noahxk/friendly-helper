const fs = require('fs');

toolToPush = {
    type: "function",
    function: {
        name: "take_user_suggestion",
        description: "Use this when a user suggests something to add to the server or to the bot. This will take their suggestion and add it to the list of suggestions. You must provide their suggestion idea.",
        parameters: {
            type: "object",
            properties: {
                suggestion: {
                    type: "string",
                    description: "The suggestion that the user made."
                },
            },
            required: ["suggestion"],
            additionalProperties: false,
        }
    }
};

function toolFunction(message, msgProfileData, response) {
    
    const suggestion = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).suggestion;

    fs.appendFile('resources/suggestions.txt', `${suggestion}\n`, (err) => {
        if(err) {
            console.log(err);
            return "There was an error submitting the user's suggestion."
        }
        return "The user's suggestion has been submitted.";
    });

}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;