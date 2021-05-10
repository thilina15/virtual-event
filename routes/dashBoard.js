const express = require('express')
const router = express.Router()
const eventAdmin = require('../models/eventAdmin')
const event = require('../models/event')
const adminAuth = require('../auth/userAuth').systemAdmin


//owner dashboard
router.get('/',adminAuth,async(req,res)=>{
    const ob = await event.find()
    res.render('ownerDashboard/dashboard',{events:ob})
})

//event admins
router.get('/eventadmins',adminAuth,async(req,res)=>{
    const admins = await eventAdmin.find()
    res.render('ownerDashboard/eventAdmins',{eventAdmins:admins})
})

//new event admin
router.get('/newEventAdmin',adminAuth,(req,res)=>{
    res.render('ownerDashboard/newEventAdmin')
})


module.exports = router