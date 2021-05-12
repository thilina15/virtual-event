const express = require('express')
const { find, findById } = require('../models/event')
const router = express.Router()
const event = require('../models/event')
const eventAdmin = require('../models/eventAdmin')
const adminAuth = require('../auth/userAuth').systemAdmin
const eventAdminAuth = require('../auth/userAuth').eventAdmin

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

module.exports = router