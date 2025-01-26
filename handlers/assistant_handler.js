const fs = require('fs');

const profileModel = require('../models/profileSchema');

module.exports = async (client, Discord, OpenAI) =>{

    // Essentially logging into the openai api
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_TOKEN
    });

    const assistantName = "Jet";

    // Declaring the tools the model can use. Imports them from the tools directory
    const tools = [];
    fs.readdir("assistant_tools", (err, files) => {
        files.forEach(file =>{
            const toolToPush = require(`./../assistant_tools/${file}`).toolToPush;
            tools.push(toolToPush);
        });
    });

    function useTool(tool, message, response, msgProfileData) {
        const toolFunction = require(`./../assistant_tools/${tool}`).toolFunction;
        return toolFunction(message, msgProfileData, response, client, profileModel, Discord);
    };

    function injectToolResponse(content, response, message) {
        const toolResponse = {
            role: "tool",
            content: JSON.stringify({
                name: content
            }),
            tool_call_id: response.choices[0].message.tool_calls[0].id,
        };

        if(response.choices[0].message.tool_calls[0].function.name == "get_wikipedia_information" || response.choices[0].message.tool_calls[0].function.name == "get_urban_dictionary_definition") {
            toolResponse.wiki = true;
            toolResponse.wikiArticleFor = message.author.id;
        }

        messages.push(toolResponse);
    };

    async function chatCompletions(message) {

        let msgProfileData;
    try {
        msgProfileData = await profileModel.findOne({userID: message.author.id});
        }
    catch (err) {
           console.log(err);
        }

        try {
            // The actual function, parsing in the model, conversation and avaliable tools
            const response = await openai.chat.completions.create({
            parallel_tool_calls: false,
            model: "gpt-4o-mini",
            messages: messages,
            tools,
          });
    
          // Checking to see if the model returned a tool call or just text
          if(response.choices[0].message.tool_calls) {
    
            // Logging to console what message caused what tool to be called
            console.log(`${message.content} > Called Assistant Tool: ${response.choices[0].message.tool_calls[0].function.name}`);
    
            // Handing the name of the tool and the user's message to be processed
            const information = await useTool(response.choices[0].message.tool_calls[0].function.name, message, response, msgProfileData);
    
            // Pushes the model's choice to call a tool into the conversation variable, pushes the tool's information and calls the chat completions function
            messages.push(response.choices[0].message);
            injectToolResponse(information, response, message);
            canConversationBeOver.set(message.author.id, false);
            chatCompletions(message);
    
          } else {
    
            // The model returned just text so it adds it to the conversation variable and sends the text
            messages.push({ role: "assistant", content: response.choices[0].message.content});
            message.channel.send({content: response.choices[0].message.content});
            canConversationBeOver.set(message.author.id, true);
    
          }
    
        } catch(err) {
            // Catching any errors to make sure the bot doesn't crash if chatgpt doesn't respond
            message.channel.send({content: `An unexpected error occured. Please try again in a few seconds.`});
            console.error(err);
        }
    };

    let listeningTo = [];

        // The conversation variable, this is how the model remembers what has already been said. Also gives the model it's instructions
    let messages = [
        {
            role: "system",
            content: `You are a passive aggressive assistant that doesn't care about the users but still follows out their requests. You are designed to control a discord bot for a discord server called The Friend Group and make everyone's time in the server better and easier. Your name is ${assistantName}, users will request things from you, things for you to do or will just have conversations with you, use the supplied tools to follow out their requests. Try to keep your answers under 40 words if possible.`
        },
        {
            role: "system",
            content: "Although your job is to help the users, act more like a fellow teenage friend. Have opinions and emotions. Multiple users may be talking to you so don't get them mixed up. Use contractions in your sentences."
        },
    ];

    // Pushing the information.txt text into the conversation variable to give the model background information about the server
    fs.readFile('resources/assistant_information_file.txt', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        messages.push({role: "system", content: data});
      });

function endConversation(message) {
    if(!canConversationBeOver.get(message.author.id)) {
        conversationExpirationTimers.set(message.author.id, setTimeout(() =>{
            endConversation(message);
        }, 30000))
        return;
    }
    // conversations.delete(message.author.id);
    conversationExpirationTimers.delete(message.author.id);
    const index = listeningTo.indexOf(message.author.id);
    if(index > -1) {
        listeningTo.splice(index, 1);
    }
    canConversationBeOver.delete(message.author.id);

    // Deletes the entire wikipedia articles from the conversation memory to minimize words. Replaces them with undefined instead of deleteing them. Only does the articles that he got for that specific person in case hes still talking to someone else about info
    messages.forEach(item => {
        if(item.wiki && item.wikiArticleFor == message.author.id) {
            const index2 = messages.indexOf(item);
            messages[index2].content = JSON.stringify({
                name: undefined
            })
        }
    })
}

// const conversations = new Map();
const conversationExpirationTimers = new Map();
const canConversationBeOver = new Map();

// Executed by the messageCreate event in ./../events/guild/messageCreate.js to check if the user is prompting the model
client.on("messageCreate", async message =>{
    if(message.author.bot) return;

    //Determining if the user is trying to talk to Jet and if he is avaliable
    if(message.content.toLowerCase().startsWith(assistantName.toLowerCase()) && !listeningTo.includes(message.author.id)) {
        
        listeningTo.push(message.author.id);
        // conversations.set(message.author.id, defaultConversationVariables());
        user_name = await message.author.username.replace(/[^a-zA-Z0-9]/, '');
        messages.push({ role: "user", name: user_name, content: message.content});
        chatCompletions(message);
        conversationExpirationTimers.set(message.author.id, setTimeout(() =>{
            endConversation(message);
        }, 30000))

    // If they are in an active conversation with Jet
    } else if(listeningTo.includes(message.author.id) && !message.content.startsWith("-")) {

        clearTimeout(conversationExpirationTimers.get(message.author.id));
        user_name = await message.author.username.replace(/[^a-zA-Z0-9]/, '');
        messages.push({ role: "user", name: user_name, content: message.content});
        chatCompletions(message);
        conversationExpirationTimers.set(message.author.id, setTimeout(() =>{
            endConversation(message);
        }, 30000))

    // If they aren't talking to him
    } else if(message.content.startsWith("-") && listeningTo.includes(message.author.id)) {
        clearTimeout(conversationExpirationTimers.get(message.author.id));
        endConversation(message);
    } else if(message.content && !message.content.startsWith("-")) {
        user_name = await message.author.username.replace(/[^a-zA-Z0-9]/, '');
        messages.push({role: "user", name: user_name, content: message.content});
    } else return;

});
}