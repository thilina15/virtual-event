if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:'../.env'})   
}


const express = require('express')
const router = express.Router()
const nodeMailer = require('nodemailer')

//config email
const transpoter = nodeMailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASS_EMAIL
    }
})

//build mail
const mailOptions = {
    from: 'thibbatz@gmail.com',
    to: 'aluthgethilina@gmail.com',
    subject: 'email from the node',
    text: 'sending Email test'
}

router.get('/',(req,res)=>{
    res.send('hellow')
    transpoter.sendMail(mailOptions,(err,info)=>{
        if(err){
            console.log(err)
        }else{
            console.log('done')
        }
    })
})



module.exports = router