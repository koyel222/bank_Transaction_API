const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique: true,
        required : true
    },
    contactNumber : {
        type : Number,
        unique: true,
        required : true
    },
    password : {
        type : String,
        required : true,
        unique : true
    },
    token : {
        type : String,
        default : undefined
    },
    balance : {
        type : Number,
        required : true
    },
    tarnsactionDetails : [{
        type : String,
    }],
    resetPasswordExpires: {
        type: Date,
    }
});

module.exports = mongoose.model('User',userSchema);