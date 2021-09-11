const express = require('express')
const router = express.Router()
const event = require('../models/event')
const exhibitor = require('../models/exhibitor')
const eventAdminAuth = require('../auth/userAuth').eventAdmin
const exhibitorAuth = require('../auth/userAuth').exhibitor
const stall = require('../models/stall')
const content = require('../models/content')
const {s3,bucketName} = require('../aws')

//file upload setup
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage:storage})


//view all content for given stall
router.get('/all/:stallID',exhibitorAuth,async(req,res)=>{
    var ob = await content.find({stallID:req.params.stallID})
    if(ob){
        res.render('contents',{contents:ob , stallID:req.params.stallID})
    }else{
        res.render('contents',{stallID:req.params.stallID})
    }
})

//view only one content
router.get('/:contentID',exhibitorAuth,async(req,res)=>{
    var ob = await content.findById(req.params.contentID)
    var st = await stall.findById(ob.stallID)
    var contents = await content.find({stallID:st.id})
    res.locals.content=ob
    res.render('contents',{stallID:st.id,contents:contents})
})

//update content
router.post('/:contentID',upload.single('image'),async(req,res)=>{
    var ob = await content.findById(req.params.contentID)

    ob.tittle = req.body.tittle
    ob.description = req.body.description

    if(req.file){
        const params = {
            Bucket: bucketName,
            Key: Date.now() + req.file.originalname, 
            Body: req.file.buffer
        }
        s3.upload(params, async function(err, data) {
            if (err) {
                throw err;
            }
            ob.image = data.Location
            await ob.save() //save with image
            var message = 'content updated successfully..!'
            res.redirect('/content/all/'+ob.stallID+'/?success='+message)  
        })
    }else{
        await ob.save()
        var message = 'content updated successfully..!'
        res.redirect('/content/all/'+ob.stallID+'/?success='+message)
    }
})

//add new content view
router.get('/new/:stallID',exhibitorAuth,async(req,res)=>{
    var ob = await content.find({stallID:req.params.stallID})
    if(ob){
        res.render('contents',{contents:ob , stallID:req.params.stallID})
    }else{
        res.render('contents',{stallID:req.params.stallID})
    }
    res.render('contents',{stallID:req.params.stallID})
})

//add a new content
router.post('/new/:stallID',upload.single('image'),async(req,res)=>{   
    var stallOB = await stall.findById(req.params.stallID)
    var ob = new content()
    ob.tittle = req.body.tittle
    ob.description = req.body.description
    ob.stallID = stallOB
    if(req.file){
        const params = {
            Bucket: bucketName,
            Key: Date.now() + req.file.originalname, 
            Body: req.file.buffer
        }
        s3.upload(params, async function(err, data) {
            if (err) {
                throw err;
            }
            ob.image = data.Location
            await ob.save() //save with image 
            var message = 'content added successfully..!'
            res.redirect('/content/all/'+req.params.stallID+'/?success='+message)
        })
    }else{
        await ob.save()
        var message = 'content added successfully..!'
        res.redirect('/content/all/'+req.params.stallID+'/?success='+message)
    }
    
})

//remove content
router.post('/remove/:contentID',async(req,res)=>{
    await content.findByIdAndRemove(req.params.contentID)
    var message = 'content deleted successfully..!'
    res.redirect('/content/all/'+req.body.stallID+'/?success='+message)

})

module.exports = router