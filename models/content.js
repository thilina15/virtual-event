const mongoose = require('mongoose')
const content = new mongoose.Schema({
    tittle:{
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
    stallID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stall'
    }
})

module.exports = mongoose.model('Content', content)