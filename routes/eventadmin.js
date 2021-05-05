const express = require('express')
const router = express.Router()
const eventAdmin = require('../models/eventAdmin')
const {v4: uuidv4} = require('uuid')


//add new event admin
router.post('/new', async(req,res)=>{
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
        res.locals.userName = ob.userName
        res.locals.password = ob.password
        res.render('ownerDashboard/loginDetails')
    }catch(err){
        res.send(err)
    }
    
})


module.exports = router