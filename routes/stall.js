
const express = require('express')
const router = express.Router()

const eventAdminAuth = require('../auth/userAuth').eventAdmin
const exhibitorAuth = require('../auth/userAuth').exhibitor
const event = require('../models/event')
const exhibitor = require('../models/exhibitor')
const stall = require('../models/stall')


//add stall package 1
router.post('/package1/:ID',async(req,res)=>{
    var ex = await exhibitor.findById(req.params.ID)
    if(ex){
        var st = new stall({
            exhibitorID:ex.id,
            eventID:ex.eventID
        })
        try{
            await st.save()
            res.send('done')
        }catch(err){
            res.redirect('/eventadmin')
            console.log('vvv')
        }
        
    }else{
        console.log('aaa')
        res.redirect('/eventadmin')
    }

})

//stall settings
router.get('/:stallID',exhibitorAuth,async(req,res)=>{
    console.log(req.params.stallID)
    var ob = await stall.findById(req.params.stallID)
    if(ob){
        res.render('stall/settings',{stall:ob})
    }else{
        res.redirect('/exhibitor')
    }
})




module.exports = router