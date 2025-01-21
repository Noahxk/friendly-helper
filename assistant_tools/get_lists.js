const fs = require('fs');

toolToPush = {
    type: "function",
    function: {
        name: "get_lists",
        description: "This will get you a list of your various lists. Use this when you need to pick a specific list to do something with in the manage_list tool. These lists are stored as text files.",
    }
};

async function toolFunction(message, msgProfileData, response) {

    const lists = fs.promises.readdir("resources/lists");
    return (await lists).join(", ").replace(".txt", "");

}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;