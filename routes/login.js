const express = require('express')
const router = express.Router()
const event = require('../models/event')

//event admins and exhibitors login
router.get('/',(req,res)=>{
    res.locals.adminLogin = false
    res.render('login/login')
})

//system admin login
router.get('/admin',(req,res)=>{
    res.locals.adminLogin = true
    res.render('login/login')
})

router.post('/admin',(req,res)=>{
    req.session.systemAdmin = true
    res.redirect('/dashboard') 
})



module.exports = router