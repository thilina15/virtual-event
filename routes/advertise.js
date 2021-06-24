
const express = require('express')
const router = express.Router()

const eventAdminAuth = require('../auth/userAuth').eventAdmin
const exhibitorAuth = require('../auth/userAuth').exhibitor
const event = require('../models/event')
const exhibitor = require('../models/exhibitor')
const stall = require('../models/stall')
const advertise = require('../models/advertise')

//file upload setup
const multer = require('multer')
const storage = multer.diskStorage({
    destination:'public/uploads/',
    filename:(req,file,cb)=>{
        cb(null, Date.now()+file.originalname)
    }
})
const upload = multer({storage:storage})

//add new advertise
router.post('/new/:exhibitorID',async(req,res)=>{
    var ex = await exhibitor.findById(req.params.exhibitorID)
    if(ex){
        var ad = new advertise({
            exhibitorID:ex.id,
            eventID:ex.eventID
        })
        try{
            await ad.save()
            var message = "advertising space added successfully!"
            res.redirect('/exhibitor/all/'+ad.eventID+'/?success='+message)
        }catch(err){
            var message = "something went wrong.. check your internet connection..!"
            res.redirect('/exhibitor/all/'+ad.eventID+'/?success='+message)
        }
        
    }else{
        var message = "something went wrong.."
        res.redirect('/eventadmin/?error='+message)
    }

})

//view all advertises for a given event
router.get('/all/:eventID',eventAdminAuth,async(req,res)=>{
    try{
        var ob = await event.findById(req.params.eventID)
        var ads = await advertise.find({eventID:req.params.eventID})
        if(ob){
            res.locals.event=ob
            res.render('eventSettings/advertises',{ads:ads})
        }else{
            res.send('no event')
        }
    }catch(err){
        res.send(err)
    }
})

//remove ad
router.post('/remove/:adID',eventAdminAuth,async(req,res)=>{
    try{
        var adObject = await advertise.findById(req.params.adID)
        var event = adObject.eventID
        await adObject.remove()
        var message = 'advertise deleted successfully..!'
        res.redirect('/advertise/all/'+event+'/?success='+message)
    }
    catch(er){

    }
})

//view an advertise for edit
router.get('/:ID',exhibitorAuth,async(req,res)=>{
    var ad = await advertise.findById(req.params.ID)
    res.render('advertiseSettings',({ad:ad}))
})

//update ad
router.post('/:ID',upload.single('image'),async(req,res)=>{
    var ob = await advertise.findById(req.params.ID)
    if(req.file){
        ob.image = '/' + req.file.destination + req.file.filename
    }
    ob.headline = req.body.headline
    ob.description = req.body.description

    try{
        await ob.save()
        const message= 'advertising space updated successfully..!'
        res.redirect('/advertise/'+req.params.ID+'/?success='+message)
    }catch(er){
        const message= 'something went wrong.. check your connection'
        res.redirect('/advertise/'+req.params.ID+'/?error='+message)
    }
    
    
})

module.exports = router