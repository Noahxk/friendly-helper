toolToPush = {
    type: "function",
    function: {
        name: "find_user_account_id",
        description: "This will get the account ID of the user you are talking to. Use this when the someone asks for their own ID or when you need their ID for something. Use this tool to get their ID instead of asking them."
    }
};

function toolFunction(message) {
    return message.author.id;
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;