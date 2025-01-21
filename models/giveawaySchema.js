const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
    giveawayID: {type: String, require: true, unique: true},
    pool: {type: Array},
    prize: {type: String, require: true}
})

const model = mongoose.model('GiveawayModels', giveawaySchema);

module.exports = model;