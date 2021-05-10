if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()   
}

const express = require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const {v4: uuidv4} = require('uuid')

const app = express()

//import routes
const homeRoute = require('./routes/home/home')
const loginRoute = require('./routes/login')
const dashBoard = require('./routes/dashBoard')
const eventAdmin = require('./routes/eventadmin')
const event = require('./routes/event')

//app config
app.set('view engine','ejs')
app.set('layout', 'layouts/layout')
app.use(expressEjsLayouts)
app.use(bodyParser.urlencoded({limit:'10mb' , extended: false}))

//session
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}))

//databse connection
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, 
    useCreateIndex: true}) 
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', ()=> console.log('connected to mongoose')) 

//setup the user
app.use((req,res,next)=>{
    if(req.session.userType){
        res.locals.userType = req.session.userType
    }
    next()
})

app.use('/',homeRoute)
app.use('/login',loginRoute)
app.use('/dashboard',dashBoard)
app.use('/eventadmin',eventAdmin)
app.use('/event',event)

app.listen(process.env.PORT||3000)
