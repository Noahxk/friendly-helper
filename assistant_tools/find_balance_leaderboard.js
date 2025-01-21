toolToPush = {
    type: "function",
    function: {
        name: "find_balance_leaderboard",
        description: "This will get you a leaderboard of everyone that has a balance in the server, sorted by the highest balance to the lowest balance. This is useful for finding out who has the most money. Put the information you recieve into an embed message.",
    }
};

async function toolFunction(message, msgProfileData, response, client, profileModel) {
    
    let leaderboard = [];
        const list = (await profileModel.find({coins: {$gte: 1}}).exec()).sort((a, b) => b.coins - a.coins);
        list.forEach((user) => {
            leaderboard.push(`**${leaderboard.length + 1}.** <@${user.userID}> - ${user.coins} :coin:`);
        });

    return leaderboard.join("\n");
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;