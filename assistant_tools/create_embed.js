toolToPush = {
    type: "function",
    function: {
        name: "create_embed",
        description: "Use this to send a special embed message to the user. Use this tool when the user requests an embed.",
        parameters: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    description: "The title or header of the embed. Usually short."
                },
                description: {
                    type: "string",
                    description: "The description/content of the embed."
                },
                colour: {
                    type: "string",
                    description: "The colour of the embed. This can be a hex code of the user's choice, randomly generated or by default the user's theme colour."
                }
            },
            required: ["colour", "title", "description"],
            additionalProperties: false,
        }
    }
};

function toolFunction(message, mpd, response, client, profileModel, Discord) {

    const embedColour = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).colour;
    const embedTitle = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).title;
    const embedDescription = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).description;

    const newEmbed = new Discord.EmbedBuilder()
				.setColor(embedColour)
				.setTitle(embedTitle)
				.setDescription(embedDescription);
		
				message.channel.send({embeds: [newEmbed]});

    return "Sent generated embed message to the user."
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;