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
    poster2:{
        type:String,
        default:'/public/images/Poster.jpg'
    },
    poster3:{
        type:String,
        default:'/public/images/Poster.jpg'
    },
    poster4:{
        type:String,
        default:'/public/images/Poster.jpg'
    },
    QRcode:String,
    streamLink:String,
    totalVisits:Number,
    visitedEmails:[
        {type:String}
    ],
    visits:[{
        count:{type:Number, default:0},
        duration:{type:Number, default:0},
        date:{
            type:Date,
            default:Date.now()
        }
    }],
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