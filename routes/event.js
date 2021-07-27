if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:'../.env'})   
}

const express = require('express')
const { find, findById } = require('../models/event')
const router = express.Router()
const event = require('../models/event')
const eventAdmin = require('../models/eventAdmin')
const adminAuth = require('../auth/userAuth').systemAdmin
const eventAdminAuth = require('../auth/userAuth').eventAdmin
const stall = require('../models/stall')
const advertise = require('../models/advertise')
const exhibitor = require('../models/exhibitor')

//image upload system
const multer = require('multer')
const storage = multer.diskStorage({
    destination:'public/uploads/',
    filename:(req,file,cb)=>{
        cb(null,Date.now()+file.originalname)
    }
})
const upload = multer({storage:storage})


//view Event request form
router.get('/request',eventAdminAuth,(req,res)=>{
    res.render('eventRequest')
})

//approve event
router.get('/approve/:id',adminAuth,async(req,res)=>{
    var ob = await event.findById(req.params.id)
    ob.state = 'active'
    await ob.save()
    var message = 'event is now active'
    res.redirect('/dashboard/?success='+message)
})

//deny event
router.get('/deny/:id',adminAuth,async(req,res)=>{
    try{
        await event.findByIdAndRemove(req.params.id)
        var message = 'event removed successfully..!'
        res.redirect('/dashboard/requests/?success='+message)
    }catch(err){
        var message = 'something went wrone..!'
        res.redirect('/dashboard/?error='+message)
    }
    
})

//visti event
router.get('/visit/:id',adminAuth,async(req,res)=>{
    try{
        var ob = await event.findById(req.params.id).populate('eventAdmin')
        res.status(200).render('eventSettings/visitRequest',{event:ob})
    }catch(err){
        var message = 'something went wrong..!'
        res.redirect('/dashboard/?error='+message)
    }
    
})

//add new event from system owner (status -> active)
router.get('/new/:id',adminAuth,async(req,res)=>{
    const ob = await eventAdmin.findById(req.params.id)
    if(ob){
        try{
            var ev = new event({
                eventAdmin:ob.id,
                name:ob.name+"'s New Event..",
                state:'active'
            })
            await ev.save()
            var message = "event added successfully..!"
            res.redirect('/dashboard/?success='+message)
        }catch(err){
            var message = "something went wrong..!"
            res.redirect('/dashboard/?error='+message)
            console.log(err)
        }
    }else{
        var message = "something went wrong..!"
        res.redirect('/dashboard/?error='+message)
    }
})

//event settings
router.get('/:eventID',eventAdminAuth,async(req,res)=>{
    try{
        var ob = await event.findById(req.params.eventID)
        if(ob){
            res.locals.event=ob
            res.render('eventSettings/settings')
        }else{
            res.send('invalid')
        }
    }catch(err){
        res.send(err)
    }
})

//event setting update
router.post('/settings/:eventID',eventAdminAuth,upload.single('image'),async(req,res)=>{
    try{
        var ob = await event.findById(req.params.eventID)
        if(ob){
            ob.name=req.body.name
            ob.description = req.body.description
            ob.layout = req.body.layout
            ob.stallPackage01 = req.body.p1
            ob.stallPackage02 = req.body.p2
            ob.stallPackage03 = req.body.p3
            if(req.file){
                console.log('file is here')
                    ob.notice =  '/' + req.file.destination + req.file.filename
                    await ob.save()//save with image  
                    res.redirect('/event/'+req.params.eventID)
            }else{
                await ob.save() //saving without image
                res.redirect('/event/'+req.params.eventID)
            }
        }
    }catch(err){

    }
})

//show event summary
router.get('/summary/:eventID',async(req,res)=>{
    var eventOB = await event.findById(req.params.eventID).populate('eventAdmin')
    var stallOBs = await stall.find({eventID:req.params.eventID})
    var adOBs = await advertise.find({eventID:req.params.eventID})
    var exhibitorOBs = await exhibitor.find({eventID:req.params.eventID})

    var stalls = []
    var emails = []
    stallOBs.forEach(stall => {
        //save visited emails
        stall.visitedEmails.forEach(email=>{
            if(!emails.includes(email)){
                emails.push(email)
            }
        })
        //save visited count and duration
        var count=0
        var duration=0
        stall.visits.forEach(visit=>{
            count+=visit.count
            duration+=visit.duration
        })
        stalls.push({
            stall:stall.name,
            visitCount:count,
            visitDuration:duration
        })
    });
    res.render('ownerDashboard/eventSummary',{stalls:stalls , event:eventOB ,exhibitors:exhibitorOBs , ads:adOBs , emails:emails})
})


module.exports = router