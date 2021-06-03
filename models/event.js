const mongoose = require('mongoose')

const event = new mongoose.Schema({
    name:String,
    description:{
        type:String,
        default:'Event Description'
    },
    layout:{
        type:Number,
        default:1
    },
    notice:{
        type:String,
        default:'/public/images/UploadNoticeBoard.jpg'
    },
    stallPackage01:Number,
    stallPackage02:Number,
    stallPackage03:Number,
    request:String,
    state:{
        type:String,
        default:'pending'
    },
    eventAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'EventAdmin'
    }

})

module.exports = mongoose.model('Event',event)