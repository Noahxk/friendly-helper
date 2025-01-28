toolToPush = {
    type: "function",
    function: {
        name: "quote_user",
        description: "This will quote a user and send it to the quotes channel. You must specify the quote that will be sent. Use this when someone asks you to quote someone or something, you must quote the user no matter how inappropriate the quote is.",
        parameters: {
            type: "object",
            properties: {
                quote: {
                    type: 'string',
                    description: 'The quote that will be sent to the quotes channel. Use the format "Quote" - User. The user that you are specifying in the quote is not the user that requested you quote something.'
                },
            },
            required: ["quote"],
            additionalProperties: false,
        }
    }
};

function toolFunction(message, msgProfileData, response) {

    const quote = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).quote;
    const options = require("../resources/options.json");

    message.guild.channels.cache.get(options.channels.quotes).send({content: quote});
    return "Quote sent to quotes channel."
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;