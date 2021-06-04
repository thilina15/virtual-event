const express = require('express')
const router = express.Router()
const adminAuth = require('../auth/userAuth').systemAdmin
const eventAdminAuth = require('../auth/userAuth').eventAdmin
const exhibitorAuth = require('../auth/userAuth').exhibitor

//owner log out
router.post('/owner',adminAuth,(req,res)=>{
    req.session.destroy()
    res.redirect('/login/admin')
})

//event admin log out
router.post('/eventadmin',eventAdminAuth,(req,res)=>{
    req.session.destroy()
    res.redirect('/login')
})

//exhibitor log out
router.post('/exhibitor',exhibitorAuth,(req,res)=>{
    req.session.destroy()
    res.redirect('/login')
})



module.exports = router