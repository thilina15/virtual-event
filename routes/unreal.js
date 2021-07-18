const e = require('express')
const express = require('express')
const router = express.Router()

const event = require('../models/event')
const stall = require('../models/stall')
const content = require('../models/content')
const ad = require('../models/advertise')



router.get('/events',async(req,res)=>{
    var ev = await event.find({state:"active"}).populate('eventAdmin')
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

//get all ads for given event
router.get('/ads/:eventID',async(req,res)=>{
    var ads = await ad.find({eventID:req.params.eventID})
    ob = {
        ads:ads
    }
    res.json(ob)
})

//add visit details
router.post('/visit/:stallID',async(req,res)=>{
    var stallOB = await stall.findById(req.params.stallID)
    if(!stallOB.visitedEmails.includes(req.body.email)){
        stallOB.visitedEmails.push(req.body.email)
    }
    const today = new Date()

    if(stallOB.visits.length===0){
        stallOB.visits.push({
            count:1,
            duration:req.body.duration,
            date:new Date()
        })
    }else{
        var lastObject = stallOB.visits[stallOB.visits.length-1]
        const lastDate = lastObject.date
        
        if(lastDate.getDate()==today.getDate() && lastDate.getMonth()==today.getMonth() && lastDate.getFullYear()==today.getFullYear()){
            stallOB.visits[stallOB.visits.length-1].count++
            stallOB.visits[stallOB.visits.length-1].duration+=Number(req.body.duration)
        }else{
            stallOB.visits.push({
                count:1,
                duration:req.body.duration,
                date:new Date()
            })
        }
    }

    
    await stallOB.save()
    res.status(200)
})




module.exports = router
