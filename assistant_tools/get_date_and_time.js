toolToPush = {
    type: "function",
    function: {
        name: "get_date_and_time",
        description: "This will get you the current date and time in Sydney, Australia."
    }
};

function toolFunction(message, msgProfileData) {
    const date = new Date();

    const sydneyTime = date.toLocaleString("en-AU", {timeZone: "Australia/Sydney"});
    return sydneyTime;
}

exports.toolToPush = toolToPush;
exports.toolFunction = toolFunction;