if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:'../.env'})   
}



const express = require('express')
const router = express.Router()
const event = require('../models/event')
const exhibitor = require('../models/exhibitor')
const {v4: uuidv4} = require('uuid')
const eventAdminAuth = require('../auth/userAuth').eventAdmin
const exhibitorAuth = require('../auth/userAuth').exhibitor
const stall = require('../models/stall')
const advertise = require('../models/advertise')

const nodeMailer = require('nodemailer')

//config email
const transpoter = nodeMailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASS_EMAIL
    }
})

//exhibitor dashboard
router.get('/',exhibitorAuth,async(req,res)=>{
    var stalls = await stall.find({exhibitorID:req.session.userObject._id})
    var ads = await advertise.find({exhibitorID:req.session.userObject._id})
    res.render('EX_dashboard',{stalls:stalls,ads:ads})
})

//view exhibitors for given event
router.get('/all/:eventID',eventAdminAuth,async(req,res)=>{
    try{
        var special_Stalls= await stall.find({eventID:req.params.eventID,isSpecial:true})
        var basic_Stalls = await stall.find({eventID:req.params.eventID,isSpecial:false})
        var ob = await event.findById(req.params.eventID)
        var exhibitors = await exhibitor.find({eventID:req.params.eventID})
        if(ob){
            res.locals.event=ob
            res.render('eventSettings/exhibitors',{exhibitors:exhibitors,special:special_Stalls.length, basic:basic_Stalls.length})
        }else{
            res.send('no event')
        }
    }catch(err){
        res.send(err)
    }
    
})

//add new exhibitor
router.get('/add/:eventID',eventAdminAuth,async(req,res)=>{
    try{
        var ob = await event.findById(req.params.eventID)
        if(ob){
            res.locals.event = ob
            res.render('eventSettings/newExhibitor')
        }else{
            res.send('no event')
        }
    }catch(err){
        res.send(err)
    }
})

//save new exhibitor
router.post('/add/:eventID',eventAdminAuth,async(req,res)=>{
    var ob = new exhibitor({
        name:req.body.name,
        address:req.body.address,
        email:req.body.email,
        mobile:req.body.mobile,
        eventID:req.params.eventID,
        userName:req.body.name + uuidv4()+Date.now(),
        password:uuidv4()
    })
    try{
        await ob.save()
        var ev = await event.findById(req.params.eventID)
        res.locals.event = ev
        res.render('eventSettings/loginDetails',{userName:ob.userName, password:ob.password,email:ob.email})
    }catch(err){
        res.send(err)
    }
})

//send user login details from email
router.post('/sendmail/:eventID',async(req,res)=>{
    console.log(req.body)
    //email sending part
    var mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: 'User credentials for Virtual Event',
        text: 'Dear exhibitor, \nHere is the login details of your account.\nUserName: '+req.body.userName+'\nPassword: '+req.body.password
    }
    transpoter.sendMail(mailOptions,(err,info)=>{
        if(err){
            var message = 'check your connection, can not send email'
            res.redirect('/exhibitor/all/'+req.params.eventID+'/?error='+message)
        }else{
            var message = 'email sent successfully'
            res.redirect('/exhibitor/all/'+req.params.eventID+'/?success='+message)
        }
    })

    
})


//account settings
router.get('/account',exhibitorAuth,async(req,res)=>{
    var ob = await exhibitor.findById(req.session.userObject._id)
    if(ob){
        res.render('EX_AccountSettings',{
            actionBasic:'/exhibitor/accountupdate',
                actionLogin:'/exhibitor/loginupdate',
                user:ob
        })
    }else{
        res.redirect('/exhibitor')
    }
    
})
//update account contact details
router.post('/accountupdate',exhibitorAuth,async(req,res)=>{
    var ob =await exhibitor.findById(req.session.userObject._id)
    if(ob){
        ob.name=req.body.name
        ob.address=req.body.address
        ob.email=req.body.email
        ob.mobile=req.body.mobile
        await ob.save()
        var message = "account details updated successfully..!"
        res.redirect('/exhibitor/account/?success='+message)
    }else{
        var message = "something went wrong..!"
        res.redirect('/exhibitor/account/?error='+message)
    }
})

//update login details
router.post('/loginupdate',exhibitorAuth,async(req,res)=>{
    var ob = await exhibitor.findById(req.session.userObject._id)
    var sameUsers = await exhibitor.find({userName:req.body.userName, _id:{$ne:req.session.userObject._id}})
    if(sameUsers.length>0){
        var message = "userName is already taken. Try a different one..!"
        res.redirect('/exhibitor/account/?error='+message)
        return
    }
    if(ob){
        if(ob.password===req.body.oldPassword && req.body.newPassword===req.body.confirmPassword){
            ob.userName=req.body.userName
            ob.password=req.body.newPassword
            await ob.save()
            var message = "login details updated successfully..!"
            res.redirect('/exhibitor/account/?success='+message)
        }else{
            var message = "wrong details entered..!"
            res.redirect('/exhibitor/account/?error='+message)
        }
    }else{
        var message ="something went wrong..!"
        res.redirect('/exhibitor/account/?error='+message)
    }
})

//remove exhibitor
router.post('/remove/:exhibitorID',eventAdminAuth,async(req,res)=>{
    
    try{
        //remove advertising spaces belongs to exhibitor
        await advertise.deleteMany({exhibitorID:req.params.exhibitorID})
        //remove stalls belongs to exhibitor
        await stall.deleteMany({exhibitorID:req.params.exhibitorID})
        //remove exhibitor
        await exhibitor.findByIdAndRemove(req.params.exhibitorID)
        var message ='exhibitor deleted successfully..'
        res.redirect('/exhibitor/all/'+req.body.eventID+'/?success='+message)
    }catch(e){
        var message ='unable to delete the exhibitor.. check the connection..'
        res.redirect('/exhibitor/all/'+req.body.eventID+'/?error='+message)
    }
    
    
})
module.exports = router