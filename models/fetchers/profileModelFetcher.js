const profileModel = require("../profileSchema");

module.exports = {
    async fetch(userID) {
        let fetchedProfile = await profileModel.findOne({userID: userID});
        if(!fetchedProfile) fetchedProfile = this.create(userID);
        return fetchedProfile;
    },
    async create(userID) {
        await profileModel.create({
            userID: userID,
            coins: 100,
            inventory: [],
            theme: 'dafffd',
            cosmetics: [],
            marriedTo: 'Not Married',
            permissionLevel: 1
        });
        return profileModel.findOne({userID: userID});
    }
}