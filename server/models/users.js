var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is Required.']
    },
    email_id: {
        type: String,
        required: [true, 'email_id is Required.']
    },
    password: {
         type: String,
        required: [true, 'Password is Required.']
    },
});

module.exports = mongoose.model('Users', UserSchema);