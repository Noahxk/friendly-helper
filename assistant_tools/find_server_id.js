toolToPush = {
    type: "function",
    function: {
        name: "find_server_id",
        description: "This will get the server ID of the server you are talking in. Use this when someone asks for the server's ID or when it is needed in another tool."
    }
};

function toolFunction(message) {
    return message.guild.id
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;