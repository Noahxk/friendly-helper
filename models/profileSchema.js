const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: {type: String, require: true, unique: true},
    coins: {type: Number, default: 100},
    inventory: {type: Array},
    theme: {type: String, require: true, default: 'dafffd'},
    cosmetics: {type: Array},
    permissionLevel: {type: Number, default: 1, require: true}
})

const model = mongoose.model('ProfileModels', profileSchema);

module.exports = model;