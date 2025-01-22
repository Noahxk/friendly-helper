const fs = require('fs');

toolToPush = {
    type: "function",
    function: {
        name: "get_lists",
        description: "This will get you a list of your various lists. Use this when you need to pick a specific list to do something with in the manage_list tool. These lists are stored as text files.",
    }
};

async function toolFunction(message, msgProfileData, response) {

    const lists = (await fs.promises.readdir("resources/lists")).filter(file => file.endsWith(".txt"));
    return (await lists).join(", ");

}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;