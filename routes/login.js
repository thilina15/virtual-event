const express = require('express')
const router = express.Router()
const eventAdmin = require('../models/eventAdmin')
const exhibitor = require('../models/exhibitor')

//event admins and exhibitors login
router.get('/',(req,res)=>{
    res.render('login/login', {admin:false})
})

router.post('/eventadmin',async(req,res)=>{
    var ob = await eventAdmin.findOne({userName:req.body.userName, password:req.body.password})
    if(ob){
        req.session.userObject=ob
        req.session.userType= 'eventAdmin'
        var message = "User Login as Event Admin Successfully..!"
        res.redirect('/eventAdmin/?success='+message)
    }else{
        var message = "invalid login details.."
        res.redirect('/login/?error='+message)
    }
})

//login exhibitor
router.post('/exhibitor',async(req,res)=>{
    var ob = await exhibitor.findOne({userName:req.body.userName, password:req.body.password})
    if(ob){
        req.session.userObject=ob
        req.session.userType= 'exhibitor'
        var message = "User Login as Exhibitor Successfully..!"
        res.redirect('/exhibitor/?success='+message)
    }else{
        var message = "invalid login details.."
        res.redirect('/login/?error='+message)
    }
})


//system admin login
router.get('/admin',(req,res)=>{
    res.render('login/login',{admin:true})
})

router.post('/admin',(req,res)=>{
    req.session.userObject = null
    req.session.userType = 'systemAdmin'
    var message = "User Login as System Owner Successfully..!"
    res.redirect('/dashboard/?success='+message) 
})



module.exports = router