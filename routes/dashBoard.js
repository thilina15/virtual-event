const express = require('express')
const router = express.Router()

//owner dashboard
router.get('/',(req,res)=>{
    res.render('ownerDashboard/dashboard')
})

//event admins
router.get('/eventadmins',(req,res)=>{
    res.render('ownerDashboard/eventAdmins')
})

//new event admin
router.get('/newEventAdmin',(req,res)=>{
    res.render('ownerDashboard/newEventAdmin')
})


module.exports = router