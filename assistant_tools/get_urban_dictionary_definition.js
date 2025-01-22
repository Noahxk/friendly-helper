const axios = require("axios");

toolToPush = {
    type: "function",
    function: {
        name: "get_urban_dictionary_definition",
        description: "This will fetch you a definition off of the urban dictionary. You must provide the search query. Use this when someone asks for a definition or when you need information that you don't have.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The definition to recieve off of the urban dictionary."
                },
            },
            required: ["query"],
            additionalProperties: false,
        }
    }
};

async function toolFunction(message, msgProfileData, response) {

    const query = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments).query;
    console.log(query);
    
    async function fetchDictionaryDefinition(query) {
        const dictionaryEndpoint = `https://unofficialurbandictionaryapi.com/api/search?term=${query}&strict=false&matchCase=false&limit=1&page=1&multiPage=false&`;

    var dictionaryConfig = {
        timeout: 10000
    }

    async function getJsonResponse(url, config) {
        const res = await axios.get(url, config);
        return await res.data;
    }
    return await getJsonResponse(dictionaryEndpoint, dictionaryConfig).then(async result => {
        return await result;
    }).catch(err => {
        console.log(err);
        return undefined;
    })
    }

        const definitionJSON = await fetchDictionaryDefinition(query);

        try {
            const definition = definitionJSON.data[0].meaning;
            return definition;
        } catch (err) {
            console.log(err)
            return undefined;
        }

}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;