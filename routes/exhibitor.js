const express = require('express')
const router = express.Router()
const event = require('../models/event')
const exhibitor = require('../models/exhibitor')
const {v4: uuidv4} = require('uuid')
const eventAdminAuth = require('../auth/userAuth').eventAdmin
const exhibitorAuth = require('../auth/userAuth').exhibitor
const stall = require('../models/stall')
const advertise = require('../models/advertise')


//exhibitor dashboard
router.get('/',exhibitorAuth,async(req,res)=>{
    var stalls = await stall.find({exhibitorID:req.session.userObject._id})
    var ads = await advertise.find({exhibitorID:req.session.userObject._id})
    res.render('EX_dashboard',{stalls:stalls,ads:ads})
})

//view exhibitors for given event
router.get('/all/:eventID',eventAdminAuth,async(req,res)=>{
    try{
        var special_Stalls= await stall.find({eventID:req.params.eventID,isSpecial:true})
        var basic_Stalls = await stall.find({eventID:req.params.eventID,isSpecial:false})
        var ob = await event.findById(req.params.eventID)
        var exhibitors = await exhibitor.find({eventID:req.params.eventID})
        if(ob){
            res.locals.event=ob
            res.render('eventSettings/exhibitors',{exhibitors:exhibitors,special:special_Stalls.length, basic:basic_Stalls.length})
        }else{
            res.send('no event')
        }
    }catch(err){
        res.send(err)
    }
    
})

//add new exhibitor
router.get('/add/:eventID',eventAdminAuth,async(req,res)=>{
    try{
        var ob = await event.findById(req.params.eventID)
        if(ob){
            res.locals.event = ob
            res.render('eventSettings/newExhibitor')
        }else{
            res.send('no event')
        }
    }catch(err){
        res.send(err)
    }
})

//save new exhibitor
router.post('/add/:eventID',eventAdminAuth,async(req,res)=>{
    var ob = new exhibitor({
        name:req.body.name,
        address:req.body.address,
        email:req.body.email,
        mobile:req.body.mobile,
        eventID:req.params.eventID,
        userName:req.body.name + uuidv4()+Date.now(),
        password:uuidv4()
    })
    try{
        await ob.save()
        var ev = await event.findById(req.params.eventID)
        res.locals.event = ev
        res.render('eventSettings/loginDetails',{userName:ob.userName, password:ob.password})
    }catch(err){
        res.send(err)
    }
})

//account settings
router.get('/account',exhibitorAuth,async(req,res)=>{
    var ob = await exhibitor.findById(req.session.userObject._id)
    if(ob){
        res.render('EX_AccountSettings',{
            actionBasic:'/exhibitor/accountupdate',
                actionLogin:'/exhibitor/loginupdate',
                user:ob
        })
    }else{
        res.redirect('/exhibitor')
    }
    
})

module.exports = router