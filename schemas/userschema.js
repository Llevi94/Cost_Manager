const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id:String, // id = email address
    first_name:String,
    last_name:String,
    email_address:String
});

const User = mongoose.model('users', userSchema);

module.exports = User;