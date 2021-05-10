const express = require('express')
const { find, findById } = require('../models/event')
const router = express.Router()
const event = require('../models/event')
const eventAdmin = require('../models/eventAdmin')
const adminAuth = require('../auth/userAuth').systemAdmin

//add new event
router.get('/new/:id',adminAuth,async(req,res)=>{
    const ob = await eventAdmin.findById(req.params.id)
    if(ob){
        try{
            var ev = new event({
                eventAdmin:ob.id,
                name:'test'
            })
            await ev.save()
            res.redirect('/dashboard')
            console.log('done')
        }catch(err){
            res.redirect('/dashboard')
            console.log(err)
        }
    }else{
        res.redirect('/dashboard')
        console.log('no OB')
    }
})


module.exports = router