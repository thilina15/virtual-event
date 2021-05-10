const express = require('express')
const router = express.Router()
const eventAdmin = require('../models/eventAdmin')
const event = require('../models/event')
const {v4: uuidv4} = require('uuid')
const eventAdminAuth = require('../auth/userAuth').eventAdmin
const adminAuth = require('../auth/userAuth').systemAdmin

//add new event admin
router.post('/new',adminAuth,async(req,res)=>{
    var ob = new eventAdmin({
        name:req.body.name,
        address:req.body.address,
        email:req.body.email,
        mobile:req.body.mobile,
        userName:req.body.name + uuidv4()+Date.now(),
        password:uuidv4()
    })
    try{
        await ob.save()
        res.render('ownerDashboard/loginDetails',{userName:ob.userName, password:ob.password})
    }catch(err){
        res.send(err)
    }
    
})

//dashboard
router.get('/',eventAdminAuth,async(req,res)=>{  
    var ob = await event.find({eventAdmin:req.session.userObject._id})
    if(ob){
        res.render('EA_dashboard',{events:ob})
    }else{
        res.render('EA_dashboard')
    }
    
})

//account settings 
router.get('/account',eventAdminAuth,async(req,res)=>{
    var ob = await eventAdmin.findById(req.session.userObject._id)
    if(ob){
        res.render('accountSettings',{
            actionBasic:'/eventadmin/accountupdate',
            actionLogin:'/eventadmin/loginupdate',
            user:ob
        })
    }
})

router.post('/accountupdate',eventAdminAuth,async(req,res)=>{
    var ob =await eventAdmin.findById(req.session.userObject._id)
    if(ob){
        ob.name=req.body.name
        ob.address=req.body.address
        ob.email=req.body.email
        ob.mobile=req.body.mobile
        await ob.save()
        res.redirect('/eventadmin/account')
    }else{
        res.redirect('/eventadmin')
    }
})

router.post('/loginupdate',eventAdminAuth,async(req,res)=>{
    var ob = await eventAdmin.findById(req.session.userObject._id)
    if(ob){
        if(ob.password===req.body.oldPassword && req.body.newPassword===req.body.confirmPassword){
            ob.userName=req.body.userName
            ob.password=req.body.newPassword
            await ob.save()
            res.redirect('/eventadmin/account')
        }else{
            res.send('wrond details')
        }
    }else{
        res.redirect('/eventadmin')
    }
})

module.exports = router