const axios = require("axios");

toolToPush = {
    type: "function",
    function: {
        name: "get_wikipedia_information",
        description: "This will fetch you information off of Wikipedia. You must specify the subject of the information you want to recieve, try to put the query into terms you would find as a title on Wikipedia. Use this when someone asks you to fetch information, or when you need information about something.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The subject of information to recieve off of Wikipedia. Spaces are replaced with underscores. Capitalize names. Do not capitalize the following words in titles if they are not names. Like what you would find a Wikipedia page to be named. No plurals."
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
    
    async function fetchWikiExtract(pageID) {
        const wikiExtractEndpoint = "https://en.wikipedia.org/w/api.php"
        const wikiExtractParams = "?action=query"
        + "&prop=extracts"
        + "&exlimit=1"
        + "&explaintext=1"
        + "&format=json"
        + "&formatversion=2"
        + "&origin=*"
        + "&pageids=" + pageID;

    const wikiExtractLink = wikiExtractEndpoint + wikiExtractParams;

    var wikiExtractConfig = {
        timeout: 10000
    }

    async function getJsonResponse(url, config) {
        const res = await axios.get(url, config);
        return await res.data;
    }
    return await getJsonResponse(wikiExtractLink, wikiExtractConfig).then(async result => {
        return await result;
    }).catch(err => {
        console.log(err);
        return undefined;
    })
    }

    async function fetchWikiPageID(query) {
        const wikiIDEndpoint = "https://en.wikipedia.org/w/api.php"
        const wikiIDParams = "?action=query"
        + "&list=search"
        + "&srsearch=" + query
        + "&format=json"
        + "&srlimit=1";

        const wikiIDLink = wikiIDEndpoint + wikiIDParams;

        var wikiIDConfig = {
            timeout: 10000
        }

        async function getJsonResponse2(url, config) {
            const res = await axios.get(url, config);
            return await res.data;
        }
        return await getJsonResponse2(wikiIDLink, wikiIDConfig).then(async result => {
            return await result;
        }).catch(err => {
            console.log(err);
            return undefined;
        })
    }

        const pageIDJSON = await fetchWikiPageID(query);
        if(pageIDJSON.query.searchinfo.totalhits == 0) return "Information Unavaliable.";
        const pageID = pageIDJSON.query.search[0].pageid;

        const pageExtractJSON = await fetchWikiExtract(pageID);
        const pageExtract = pageExtractJSON.query.pages[0].extract;

        return pageExtract;

}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;