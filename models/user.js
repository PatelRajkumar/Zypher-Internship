// declare User Schema
//don't use any validator 
const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    CorporateId: {
        type: String, // Firebase
        required: true
    }
});
const User = mongoose.model('User', UserSchema)
module.exports = User