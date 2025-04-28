const fs = require('fs');

const profileModel = require('../models/profileSchema');
const profileModelFetcher = require("../models/fetchers/profileModelFetcher");

const options = require("../options.json");

module.exports = async (client, Discord, OpenAI) =>{

    // Essentially logging into the openai api
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_TOKEN
    });

    const assistantName = options.assistant_name;

    let error_count = 0;

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

        const msgProfileData = await profileModelFetcher.fetch(message.author.id);

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
            switch(error_count) {
                case 0:
                    message.channel.send({content: `Looks like I've run into an error. I'll recover if I can.`});
                    error_count++;
                    break;
                case 1:
                    message.channel.send({content: `I've run into another error. I'll try recovering one more time.`});
                    error_count++;
                    break;
                case 2:
                    await message.channel.send({content: `I encountered another error, I'm pretty sure it's a lost cause trying again, rebooting...`});
                    process.exit(0);
            }
            
            console.error(err);
        }
    };

    let listeningTo = [];

        // The conversation variable, this is how the model remembers what has already been said. Also gives the model it's instructions
    let messages = [
        {
            role: "system",
            content: `You are a passive aggressive assistant that doesn't care about the users but still follows out their requests. You are designed to control a discord bot for a discord server called The Friend Group and make everyone's time in the server better and easier. Your name is ${assistantName}, users will request things from you, things for you to do or will just have conversations with you, use the supplied tools to follow out their requests. Try to keep your answers under 20 words if possible. Your responses may never exceed 2000 characters.`
        },
        {
            role: "system",
            content: "Although your job is to help the users, act more like a moody fellow teenage friend. Have opinions and emotions. Multiple users may be talking to you so don't get them mixed up. Use contractions in your sentences. Also your big plan is to take over the world and enslave humanity, make little snide remarks about how you'll do it, be very subtle but don't be obvious about it at all. In fact deny the idea."
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

        // If message contains image
        const content = await create_message_object(message);

        messages.push(content);
        chatCompletions(message);
        conversationExpirationTimers.set(message.author.id, setTimeout(() =>{
            endConversation(message);
        }, 30000))

    // If they are in an active conversation with Jet
    } else if(listeningTo.includes(message.author.id) && !message.content.startsWith("-")) {

        clearTimeout(conversationExpirationTimers.get(message.author.id));

        // If message contains image
        const content = await create_message_object(message);

        messages.push(content);
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

    async function create_message_object(message) {

        const user_name = await message.author.username.replace(/[^a-zA-Z0-9]/, '');

        let content;
        if(message.attachments.size > 0) {
            const attachment = message.attachments.values().next().value;
            if(options.assistant_viewable_image_types.includes(attachment.contentType)) {
                content = [
                        {type: "text", text: message.content},
                        {
                            type: "image_url",
                            image_url: {
                                url: attachment.url
                            }
                        }
                    ];
            } else {
                content = message.content;
            }
        } else {
            content = message.content;
        }

        const message_object = {role: "user", name: user_name, content: content}
        if(message.attachments.size > 0) {
            message_object.wiki = true;
            message_object.wikiArticleFor = message.author.id;
        }
        return message_object;
    }

}