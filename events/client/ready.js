const { ActivityType } = require('discord.js');
module.exports = (Discord, client) => {
    console.log('Bot Online')

    const activities =  require("../../resources/activities.json").activities;
    changeActivity();

    setInterval(changeActivity, 3600000);

    function changeActivity() {
        const activity = activities[Math.floor(Math.random() * activities.length)];

        switch(activity.type) {
            case "watching":
                activity.type = ActivityType.Watching;
                break;
            case "playing":
                activity.type = ActivityType.Playing;
                break;
            case "listening":
                activity.type = ActivityType.Listening;
                break;
        }

        client.user.setPresence({
            activities: [{ name: activity.name, type: activity.type }],
            status: 'online',
        });
    }
}
    