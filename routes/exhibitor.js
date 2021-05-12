const express = require('express')
const router = express.Router()
const event = require('../models/event')
const eventAdminAuth = require('../auth/userAuth').eventAdmin




//view exhibitors for given event
router.get('/all/:eventID',eventAdminAuth,async(req,res)=>{
    try{
        var ob = await event.findById(req.params.eventID)
        if(ob){
            res.locals.event=ob
            res.render('eventSettings/exhibitors')
        }else{
            res.send('no event')
        }
    }catch(err){
        res.send(err)
    }
    
})

module.exports = router