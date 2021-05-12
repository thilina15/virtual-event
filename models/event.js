const mongoose = require('mongoose')

const event = new mongoose.Schema({
    name:String,
    description:String,
    layout:{
        type:Number,
        default:1
    },
    notice:{
        type:String,
    },
    stallPackage01:Number,
    stallPackage02:Number,
    stallPackage03:Number,
    eventAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'EventAdmin'
    }

})

module.exports = mongoose.model('Event',event)