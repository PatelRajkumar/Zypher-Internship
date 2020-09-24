//declare Userlog Schema
const mongoose = require('mongoose')
const User = require('./user')
const SessionLogSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    event_type: {
        // unique: true,
        type: String,
        required: false
    },
    timeStamp: {
        type: Date,
        required: true,
        default: Date.now()
    }
});
const UserLog = mongoose.model('UserLogs', SessionLogSchema)
module.exports = UserLog