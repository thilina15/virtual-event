
const express = require('express')
const router = express.Router()

const eventAdminAuth = require('../auth/userAuth').eventAdmin
const exhibitorAuth = require('../auth/userAuth').exhibitor
const event = require('../models/event')
const exhibitor = require('../models/exhibitor')
const stall = require('../models/stall')

//file upload setup
const multer = require('multer')
const storage = multer.diskStorage({
    destination:'public/uploads/',
    filename:(req,file,cb)=>{
        cb(null, Date.now()+file.originalname)
    }
})
const upload = multer({storage:storage})


//add stall package 1
router.post('/package1/:ID',async(req,res)=>{
    var ex = await exhibitor.findById(req.params.ID)
    if(ex){
        var st = new stall({
            exhibitorID:ex.id,
            eventID:ex.eventID
        })
        try{
            await st.save()
            res.send('done')
        }catch(err){
            res.redirect('/eventadmin')
            console.log('vvv')
        }
        
    }else{
        console.log('aaa')
        res.redirect('/eventadmin')
    }

})

//stall settings
router.get('/:stallID',exhibitorAuth,async(req,res)=>{
    console.log(req.params.stallID)
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

    if(req.files.logoImage){
        var image = req.files.logoImage[0]
        stallOB.logoImage = '/'+image.destination + image.filename 
    }
    if(req.files.nameImage){
        var image = req.files.nameImage[0]
        stallOB.nameImage = '/'+image.destination + image.filename 
    }
    if(req.files.QRcode){
        var image = req.files.QRcode[0]
        stallOB.QRcode = '/'+image.destination + image.filename 
    }
    if(req.files.poster1){
        var image = req.files.poster1[0]
        stallOB.poster1 = '/'+image.destination + image.filename 
    }
    if(req.files.poster2){
        var image = req.files.poster2[0]
        stallOB.poster2 = '/'+image.destination + image.filename 
    }
    if(req.files.poster3){
        var image = req.files.poster3[0]
        stallOB.poster3 = '/'+image.destination + image.filename 
    }
    if(req.files.poster4){
        var image = req.files.poster4[0]
        stallOB.poster4 = '/'+image.destination + image.filename 
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


module.exports = router