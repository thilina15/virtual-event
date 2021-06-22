if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:'../.env'})   
}


const express = require('express')
const router = express.Router()
const nodeMailer = require('nodemailer')
const eventAdminAuth = require('../auth/userAuth').eventAdmin
const event = require('../models/event')

//config email
const transpoter = nodeMailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASS_EMAIL
    }
})


//event request
router.post('/eventrequest',eventAdminAuth,async(req,res)=>{
    var ob = new event({ //this event in pending state
        request:{
            name:req.body.name,
            stalls:req.body.stalls,
            ads:req.body.ads,
            duration:req.body.duration,
            description:req.body.description
        },
        name:req.body.name,
        description:req.body.description,
        eventAdmin: req.session.userObject._id
    })
    //build email body
    var emailMessage = 'Dear Admin, \n'+ req.session.userObject.name+ ' has made an event request. login to your admin panel to handdle this request..\n \n'
    var eventDescription = 'Event Name: '+req.body.name+ '\nEvent Description: '+req.body.description+'\n \n'
    var contact = 'Event Admin,\n name: '+req.session.userObject.name+'\n E-mail: '+req.session.userObject.email+'\n Mobile: '+req.session.userObject.mobile
    var finalEmail = emailMessage+eventDescription+contact
    //build mail (sending to system owner)
    var mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'New Event is waiting..',
        text:finalEmail
    }
    try{
        await ob.save()
        transpoter.sendMail(mailOptions,(err,info)=>{
            if(err){
                var message = "system error.. contact us for help..!"
                res.redirect('/eventadmin/?error='+message)
            }else{
                var message = "request sent successfully..!"
                res.redirect('/eventadmin/?success='+message)
            }
        })
    }catch(err){
        var message = "something went Wrong.. try again"
        res.redirect('/eventadmin/?error='+message)
    }
})









module.exports = router