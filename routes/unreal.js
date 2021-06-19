const e = require('express')
const express = require('express')
const router = express.Router()

const event = require('../models/event')
const stall = require('../models/stall')



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


router.get('/stalls/:eventID',async(req,res)=>{
    var stalls = await stall.find({eventID:req.params.eventID})
    ob = {
        stalls:stalls
    }
    console.log(ob);
    res.json(ob)
})










module.exports = router
