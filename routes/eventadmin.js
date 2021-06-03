const express = require('express')
const router = express.Router()
const eventAdmin = require('../models/eventAdmin')
const event = require('../models/event')
const {v4: uuidv4} = require('uuid')
const eventAdminAuth = require('../auth/userAuth').eventAdmin
const adminAuth = require('../auth/userAuth').systemAdmin
const { route } = require('./event')


//add new event Admin
router.get('/new',(req,res)=>{
    res.render('ownerDashboard/newEventAdmin')
})

router.post('/new',async(req,res)=>{
    var sameUsers = await eventAdmin.find({userName:req.body.userName})
    if(sameUsers.length>0){
        var message = "User Name already exist.. try a different one.."
        res.redirect('/eventadmin/new/?error='+message)
        return
    }
    var ob = new eventAdmin({
        name:req.body.name,
        address:req.body.address,
        email:req.body.email,
        mobile:req.body.mobile,
        userName:req.body.userName,
        password:req.body.password
    })
    try{
        await ob.save()
        var message = "Account created successfully..! Now you can login."
        res.redirect('/login/?success='+message)
    }catch(err){
        var message = "Something went wrong... Try Again.."
        res.redirect('/eventadmin/new/?error='+message)
    }
    
})

//dashboard
router.get('/',eventAdminAuth,async(req,res)=>{  
    var ob = await event.find({eventAdmin:req.session.userObject._id, state:'active'})
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

//contact details update
router.post('/accountupdate',eventAdminAuth,async(req,res)=>{
    var ob =await eventAdmin.findById(req.session.userObject._id)
    if(ob){
        ob.name=req.body.name
        ob.address=req.body.address
        ob.email=req.body.email
        ob.mobile=req.body.mobile
        await ob.save()
        var message = "account details updated successfully..!"
        res.redirect('/eventadmin/account/?success='+message)
    }else{
        var message = "something went wrong..!"
        res.redirect('/eventadmin/?error='+message)
    }
})

//update login details
router.post('/loginupdate',eventAdminAuth,async(req,res)=>{
    var ob = await eventAdmin.findById(req.session.userObject._id)
    var sameUsers = await eventAdmin.find({userName:req.body.userName, _id:{$ne:req.session.userObject._id}})
    if(sameUsers.length>0){
        var message = "userName is already taken. Try a different one..!"
        res.redirect('/eventadmin/account/?error='+message)
        return
    }
    if(ob){
        if(ob.password===req.body.oldPassword && req.body.newPassword===req.body.confirmPassword){
            ob.userName=req.body.userName
            ob.password=req.body.newPassword
            await ob.save()
            var message = "login details updated successfully..!"
            res.redirect('/eventadmin/account/?success='+message)
        }else{
            var message = "wrong details entered..!"
            res.redirect('/eventadmin/account/?error='+message)
        }
    }else{
        var message ="something went wrong..!"
        res.redirect('/eventadmin/?error='+message)
    }
})

module.exports = router