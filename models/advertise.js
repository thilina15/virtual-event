const mongoose = require('mongoose')
const advertise = new mongoose.Schema({
    headline:{
        type:String,
        default:'headline of the advertise'
    },
    description:{
        type:String,
        default:'description of the advertise'
    },
    image:{
        type:String,
        default:'/public/images/Poster.jpg'
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