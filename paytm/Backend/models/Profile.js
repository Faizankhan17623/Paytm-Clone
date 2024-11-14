const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    Username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase :true,
        // minLength : 4,
        maxLength:30
    },
    firstName:{
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName:{
        type: String,
        trim: true,
        maxLength: 50
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        // maxLength:15
    },
    confirmPassword : {
        type: String,
        required: true,
        minLength: 6,
        // maxLength:15
    },
    email:{
        type:String,
        required:true
    },
    image:{
        type:String
    }
},{timestamps:true})

module.exports = mongoose.model('User',UserSchema)