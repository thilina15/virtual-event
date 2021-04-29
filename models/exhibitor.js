const mongoose = require('mongoose')
const exhibitor = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    eventID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event'
    }
})

module.exports = mongoose.model('Exhibitor',exhibitor)