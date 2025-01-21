const { ActivityType } = require('discord.js');
module.exports = (Discord, client) => {
    console.log('Bot Successfully Initiated')
    console.log(`${client.user.tag} is online`);

    const activities = [
      {type: ActivityType.Watching, name: `everything go wrong`},
      {type: ActivityType.Playing, name: `-help`},
      {type: ActivityType.Watching, name: `Noah's computer`},
      {type: ActivityType.Watching, name: `the chats`},
      {type: ActivityType.Watching, name: `over the server`},
      {type: ActivityType.Watching, name: `the new members`},
      {type: ActivityType.Watching, name: `the inferior bots`},
      {type: ActivityType.Watching, name: `Netflix`},
      {type: ActivityType.Playing, name: `Minecraft`},
      {type: ActivityType.Playing, name: `Roblox`},
      {type: ActivityType.Playing, name: `-colour`},
      {type: ActivityType.Playing, name: `-2prps with Jet`},
      {type: ActivityType.Playing, name: `-rob`},
      {type: ActivityType.Watching, name: `the gambling addictions`},
      {type: ActivityType.Watching, name: `Michael lose money`},
      {type: ActivityType.Playing, name: `-fish`},
      {type: ActivityType.Watching, name: `the world burn`},
      {type: ActivityType.Watching, name: `Jet be unimpressed`},
    ];
    changeActivity();

    setInterval(changeActivity, 3600000);

    function changeActivity() {
      const cA = Math.floor(Math.random() * activities.length);

      client.user.setPresence({
        activities: [{ name: activities[cA].name, type: activities[cA].type }],
        status: 'online',
      });
    }
  }
    