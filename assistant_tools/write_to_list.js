const fs = require('fs');

toolToPush = {
    type: "function",
    function: {
        name: "write_to_list",
        description: "This will let you write something into one of your various lists. You must provide the name of the list, choose one with the get_lists tool. If you provide the name of a list that does not already exist, a new one with that name will be created.",
        parameters: {
            type: "object",
            properties: {
                list_name: {
                    type: "string",
                    description: "The name of the list. Use the get_lists tool to get a list of the avaliable lists. Spaces must be underscores. Must end with .txt"
                },
                content: {
                    type: "string",
                    description: "The content to add to the list"
                },
            },
            required: ["list_name", "content"],
            additionalProperties: false,
        }
    }
};

async function toolFunction(message, msgProfileData, response) {
    
    const list_name = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).list_name;
    const content = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).content;

    fs.appendFile(`resources/lists/${list_name}`, `${content}\n `, (err) => {
        if(err) {
            console.log(err);
            return "There was an error writing to the list."
        }
        return "The content has been added to the selected list.";
    });        
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;