const mongoose = require('mongoose')
const advertise = new mongoose.Schema({
    headline:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    eventID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event'
    },
    exhibitorID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Exhibitor'
    }
})

module.exports = mongoose.model('Advertise',advertise)