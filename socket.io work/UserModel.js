const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    _id: String,
    username: String,

})

module.exports = mongoose.model('Users', UserSchema)