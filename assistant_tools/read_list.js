const fs = require('fs');

toolToPush = {
    type: "function",
    function: {
        name: "read_list",
        description: "This will get you the content of one of your various lists. You must provide the name of the list you want to view. Use this when you need to see what is written in a list.",
        parameters: {
            type: "object",
            properties: {
                list_name: {
                    type: "string",
                    description: "The name of the list. Use the get_lists tool to get a list of the avaliable lists. Spaces must be underscores. Must end with .txt"
                },
            },
            required: ["list_name"],
            additionalProperties: false,
        }
    }
};

async function toolFunction(message, msgProfileData, response) {
    
    const list_name = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).list_name;
    console.log(list_name);

    try{
        const content = await fs.promises.readFile(`resources/lists/${list_name}`, 'utf8');
        return content;  
    } catch (err) {
        console.log(err);
        return undefined;
    }
    
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;