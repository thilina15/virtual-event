const express = require('express')
const router = express.Router()
const eventAdmin = require('../models/eventAdmin')

//event admins and exhibitors login
router.get('/',(req,res)=>{
    res.render('login/login', {admin:false})
})

router.post('/eventadmin',async(req,res)=>{
    var ob = await eventAdmin.findOne({userName:req.body.userName, password:req.body.password})
    if(ob){
        req.session.userObject=ob
        req.session.userType= 'eventAdmin'
        res.redirect('/eventAdmin')
    }else{
        res.redirect('/login')
    }
})


//system admin login
router.get('/admin',(req,res)=>{
    res.render('login/login',{admin:true})
})

router.post('/admin',(req,res)=>{
    req.session.userObject = null
    req.session.userType = 'systemAdmin'
    res.redirect('/dashboard') 
})



module.exports = router