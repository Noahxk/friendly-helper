const fs = require('fs');

toolToPush = {
    type: "function",
    function: {
        name: "manage_list",
        description: "This will let you do something with one of your various lists. You must specify the list to modify, get the avaliable lists with the get_lists tool. You must also specify action to do, you can add to an existing list or create a new list.",
        parameters: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    description: "What action to perform, can either be write or create."
                },
                action: {
                    type: "string",
                    description: "What to do with the file, can either be view or write."
                },
            },
            required: ["name", "action"],
            additionalProperties: false,
        }
    }
};

async function toolFunction(message, msgProfileData, response) {
    
    const name = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).name;
    const action = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).action;

    switch(action) {
        case "write":
            fs.appendFile('resources/sex_offender_list.txt', `${name}, `, (err) => {
                if(err) {
                    console.log(err);
                    return "There was an error writing to the list."
                }
                return "The user has been added to the list.";
            });
            break;
        case "view":
            try {
                const data = fs.promises.readFile("resources/sex_offender_list.txt", "utf8");
                return data;
            } catch(err) {
                console.log(err);
                return undefined;
            }
            break;
        default:
            return "Invalid action, must be view or write.";
    }
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;