const express = require('express')
const { find, findById } = require('../models/event')
const router = express.Router()
const event = require('../models/event')
const eventAdmin = require('../models/eventAdmin')
const adminAuth = require('../auth/userAuth').systemAdmin
const eventAdminAuth = require('../auth/userAuth').eventAdmin

//image upload system
const multer = require('multer')
const aws = require('aws-sdk')
const s3 = new aws.S3({
    accessKeyId:"AKIASNTBNYDRYSNLE2UV",
    secretAccessKey:"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"
})
const bucketName = 'jerax-bucket'
const storage = multer.memoryStorage()
const upload = multer({storage:storage})


//add new event
router.get('/new/:id',adminAuth,async(req,res)=>{
    const ob = await eventAdmin.findById(req.params.id)
    if(ob){
        try{
            var ev = new event({
                eventAdmin:ob.id,
                name:'test'
            })
            await ev.save()
            res.redirect('/dashboard')
            console.log('done')
        }catch(err){
            res.redirect('/dashboard')
            console.log(err)
        }
    }else{
        res.redirect('/dashboard')
        console.log('no OB')
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
                const params = {
                    Bucket:bucketName,
                    Key:Date.now()+req.file.originalname,
                    Body:req.file.buffer
                }
                s3.upload(params,async function(err,data){
                    if(err){
                        throw err
                    }
                    console.log(`1 File uploaded successfully. ${data.Location}`);
                    ob.notice = data.Location
                    await ob.save()//save with image  
                    res.redirect('/event/'+req.params.eventID)
                })
            }else{
                await ob.save() //saving without image
                res.redirect('/event/'+req.params.eventID)
            }
        }
    }catch(err){

    }
})

module.exports = router