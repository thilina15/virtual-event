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
const exhibitorRoute = require('./routes/exhibitor')

//app config
app.set('view engine','ejs')
app.set('layout', 'layouts/layout')
app.use(expressEjsLayouts)
app.use('/public',express.static('public'))
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

//setup the user and alert messages
app.use((req,res,next)=>{
    if(req.session.userType){
        res.locals.userType = req.session.userType
    }
    if(req.query.success){
        res.locals.success = req.query.success
    }
    if(req.query.error){
        res.locals.error = req.query.error
    }
    next()
})

app.use('/',homeRoute)
app.use('/login',loginRoute)
app.use('/dashboard',dashBoard)
app.use('/eventadmin',eventAdmin)
app.use('/event',event)
app.use('/exhibitor',exhibitorRoute)

app.listen(process.env.PORT||3000)
