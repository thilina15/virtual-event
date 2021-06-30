const e = require('express')
const express = require('express')
const router = express.Router()

const event = require('../models/event')
const stall = require('../models/stall')
const content = require('../models/content')



router.get('/events',async(req,res)=>{
    var ev = await event.find({state:"active"})
    ob={
        events:ev
    }
    res.json(ob)
})

router.post('/events',(req,res)=>{
    res.json({image:req.body.image})
})

//get all stalls for given event ID
router.get('/stalls/:eventID',async(req,res)=>{
    var stalls = await stall.find({eventID:req.params.eventID})
    ob = {
        stalls:stalls
    }
    console.log(ob);
    res.json(ob)
})

//get all contents for given stall ID
router.get('/contents/:stallID',async(req,res)=>{
    var contents = await content.find({stallID:req.params.stallID})
    ob = {
        contents:contents
    }
    console.log(ob);
    res.json(ob)
})








module.exports = router
