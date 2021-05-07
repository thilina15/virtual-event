const express = require('express')
const router = express.Router()
const eventAdmin = require('../models/eventAdmin')

//event admins and exhibitors login
router.get('/',(req,res)=>{
    res.locals.adminLogin = false
    res.render('login/login')
})

router.post('/eventadmin',async(req,res)=>{
    var ob = await eventAdmin.findOne({userName:req.body.userName, password:req.body.password})
    if(ob){
        req.session.eventAdmin=ob
        res.send(ob)
    }else{
        res.redirect('/login')
    }
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