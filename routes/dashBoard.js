const express = require('express')
const router = express.Router()
const eventAdmin = require('../models/eventAdmin')
const event = require('../models/event')

//owner dashboard
router.get('/',async(req,res)=>{
    const ob = await event.find()
    res.locals.events = ob
    res.render('ownerDashboard/dashboard')
})

//event admins
router.get('/eventadmins',async(req,res)=>{
    const admins = await eventAdmin.find()
    res.locals.eventAdmins=admins
    res.render('ownerDashboard/eventAdmins')
})

//new event admin
router.get('/newEventAdmin',(req,res)=>{
    res.render('ownerDashboard/newEventAdmin')
})


module.exports = router