
const express = require('express')
const router = express.Router()


const eventAdminAuth = require('../auth/userAuth').eventAdmin
const exhibitorAuth = require('../auth/userAuth').exhibitor
const event = require('../models/event')
const exhibitor = require('../models/exhibitor')
const stall = require('../models/stall')
const content = require('../models/content')
const {fileUpload} = require('../aws')



//file upload setup
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage:storage})


//add stall package 1
router.post('/package1/:ID',async(req,res)=>{
    var ex = await exhibitor.findById(req.params.ID)
    if(ex){
        var st = new stall({
            package:1,
            exhibitorID:ex.id,
            eventID:ex.eventID
        })
        try{
            await st.save()
            var message = 'stall added successfully..!'
            res.redirect('/exhibitor/all/'+st.eventID+'/?success='+message)
        }catch(err){
            var message = 'something went wrong check internet connection..!'
            res.redirect('/exhibitor/all/'+st.eventID+'/?error='+message)
        }
        
    }else{
        var message = 'something went wrong..!'
            res.redirect('/eventadmin/?error='+message)
    }

})

//add stall package 2
router.post('/package2/:ID',async(req,res)=>{
    var ex = await exhibitor.findById(req.params.ID)
    if(ex){
        var st = new stall({
            package:2,
            exhibitorID:ex.id,
            eventID:ex.eventID
        })
        try{
            await st.save()
            var message = 'stall added successfully..!'
            res.redirect('/exhibitor/all/'+st.eventID+'/?success='+message)
        }catch(err){
            var message = 'something went wrong check internet connection..!'
            res.redirect('/exhibitor/all/'+st.eventID+'/?error='+message)
        }
        
    }else{
        var message = 'something went wrong..!'
            res.redirect('/eventadmin/?error='+message)
    }

})

//add stall package 3
router.post('/package3/:ID',async(req,res)=>{
    var ex = await exhibitor.findById(req.params.ID)
    if(ex){
        var st = new stall({
            package:3,
            exhibitorID:ex.id,
            eventID:ex.eventID
        })
        try{
            await st.save()
            var message = 'stall added successfully..!'
            res.redirect('/exhibitor/all/'+st.eventID+'/?success='+message)
        }catch(err){
            var message = 'something went wrong check internet connection..!'
            res.redirect('/exhibitor/all/'+st.eventID+'/?error='+message)
        }
        
    }else{
        var message = 'something went wrong..!'
            res.redirect('/eventadmin/?error='+message)
    }

})


//add stall Special
router.post('/special/:ID',async(req,res)=>{
    var ex = await exhibitor.findById(req.params.ID)
    if(ex){
        var st = new stall({
            isSpecial:true,
            package:3,
            exhibitorID:ex.id,
            eventID:ex.eventID
        })
        try{
            await st.save()
            var message = 'special stall added successfully..!'
            res.redirect('/exhibitor/all/'+st.eventID+'/?success='+message)
        }catch(err){
            var message = 'something went wrong check internet connection..!'
            res.redirect('/exhibitor/all/'+st.eventID+'/?error='+message)
        }
        
    }else{
        var message = 'something went wrong..!'
            res.redirect('/eventadmin/?error='+message)
    }

})

//stall settings
router.get('/:stallID',exhibitorAuth,async(req,res)=>{
    var ob = await stall.findById(req.params.stallID)
    if(ob){
        res.render('stall/settings',{stall:ob})
    }else{
        res.redirect('/exhibitor')
    }
})





//stall settings update
router.post('/:stallID',exhibitorAuth,upload.fields([
    {name:'logoImage',maxCount:1},
    {name:'nameImage',maxCount:1},
    {name:'QRcode',maxCount:1},
    {name:'poster1',maxCount:1},
    {name:'poster2',maxCount:1},
    {name:'poster3',maxCount:1},
    {name:'poster4',maxCount:1},
]),async(req,res)=>{
    var stallOB = await stall.findById(req.params.stallID)

    try{
        stallOB.logoImage =  await fileUpload(req.files.logoImage)
    }catch(e){

    }
    try{
        stallOB.nameImage =  await fileUpload(req.files.nameImage)
    }catch(e){

    }
    try{
        stallOB.QRcode =  await fileUpload(req.files.QRcode)
    }catch(e){

    }
    try{
        stallOB.poster1 =  await fileUpload(req.files.poster1)
    }catch(e){

    }
    try{
        stallOB.poster2 =  await fileUpload(req.files.poster2)
    }catch(e){

    }
    try{
        stallOB.poster3 =  await fileUpload(req.files.poster3)
    }catch(e){

    }
    try{
        stallOB.poster4 =  await fileUpload(req.files.poster4)
    }catch(e){

    }

    stallOB.name = req.body.name
    stallOB.description = req.body.description
    stallOB.model = req.body.model
    stallOB.characterType = req.body.characterType
    stallOB.webSite = req.body.webSite
    stallOB.streamLink = req.body.streamLink

    await stallOB.save()
    res.redirect('/stall/'+stallOB.id)
    

})

//view all stalls for a given event
router.get('/all/:eventID',eventAdminAuth,async(req,res)=>{
    try{
        var ob = await event.findById(req.params.eventID)
        var stalls = await stall.find({eventID:req.params.eventID}).populate('exhibitorID')
        console.log(stalls)
        if(ob){
            res.locals.event=ob
            res.render('eventSettings/stalls',{stalls:stalls})
        }else{
            res.send('no event')
        }
    }catch(err){
        res.send(err)
    }
})

//remove stall
router.post('/remove/:stallID',eventAdminAuth,async(req,res)=>{
        await content.remove({stallID:req.params.stallID})
    try{
        var stallObject = await stall.findById(req.params.stallID)
        var event = stallObject.eventID
        await stallObject.remove()
        var message = 'stall deleted successfully..!'
        res.redirect('/stall/all/'+event+'/?success='+message)
    }
    catch(er){

    }
})


//stall report
router.get('/report/:stallID',async(req,res)=>{
    var ob = await stall.findById(req.params.stallID)
    var visitsOB = []
    var totalVisit=0;
    var totalDuration=0;
    ob.visits.forEach(visit => {
        const date = new Date(visit.date).toLocaleDateString()
        visit.date="asd"
        visitsOB.push({
            count:visit.count,
            duration:visit.duration,
            date:date
        })
        totalVisit+=visit.count
        totalDuration+=visit.duration
    });
    res.render('reports/stallReport',{stall:ob, sample:visitsOB, visitCount:totalVisit, visitDuration:totalDuration})
})

module.exports = router