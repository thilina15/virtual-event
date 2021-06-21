const mongoose = require('mongoose')
const stall = new mongoose.Schema({
    name:{
        type:String,
        default:'Stall Name'
    },
    description:{
        type:String,
        default:'Stall Description'
    },
    model:{
        type:Number,
        default:2
    },
    package:{
        type:Number,
        default:1
    },
    isSpecial:{
        type:Boolean,
        default:false
    },
    characterType:{
        type:Number,
        default:1
    },
    webSite:String,
    nameImage:{
        type:String,
        default:'/public/images/stallName.jpg'
    },
    logoImage:{
        type:String,
        default:'/public/images/logoImage.jpg'
    },
    poster1:{
        type:String,
        default:'/public/images/Poster.jpg'
    },
    poster2:String,
    poster3:String,
    poster4:String,
    QRcode:String,
    streamLink:String,
    totalVisits:Number,
    visitedEmails:[
        {type:String}
    ],
    exhibitorID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Exhibitor'
    },
    eventID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event'
    }
})

module.exports = mongoose.model('Stall',stall)