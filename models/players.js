var mongoose = require('mongoose');

var playerSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    players: {
        type: [{
            name: String,
            position: String
        }],
        validate: {
            validator: function(array) {
                return array.length <= 11; // Maximum length of 11 players
            },
            message: 'You cannot have more than 11 players.'
        }
    }
});

var UserSchema = mongoose.model("fantasyplayers", playerSchema);
module.exports = UserSchema;
