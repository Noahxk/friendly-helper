const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: {type: String, require: true, unique: true},
    username: {type: String},
    coins: {type: Number, default: 100},
    inventory: {type: Array},
    theme: {type: String, require: true, default: '#1e0d8e'},
    cosmetics: {type: Array},
    marriedTo: {type: String, default: 'Not Married'},
    permissionLevel: {type: Number, default: 1, require: true}
})

const model = mongoose.model('ProfileModels', profileSchema);

module.exports = model;