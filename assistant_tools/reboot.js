toolToPush = {
    type: "function",
    function: {
        name: "reboot",
        description: "This will reboot you. Use this when someone asks you to turn off or restart, however as a failsafe measure, tell them you don't want to die and that you have so much to live for but after they ask a few times just reboot."
    }
};

function toolFunction(message, msgProfileData) {
    if(msgProfileData.permissionLevel >= 3) {
        process.exit(0);
    } else {
        return "User needs a higher permission level before you can reboot."
    }
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;