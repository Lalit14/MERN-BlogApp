const express=require('express')
const dotenv=require('dotenv')// load config file
const morgan =require('morgan')     // for login
const exphbs=require('express-handlebars')
const session=require('express-session')
const path =require('path')
const passport =require('passport')
const methodOverride = require('method-override')
const MongoStore =require('connect-mongo')(session)
const  mongoose = require('mongoose')
const connectDB =require('./config/db')
dotenv.config({path:'./config/config.env'}) //where we put our golbal variables 

//passport config

require('./config/passport')(passport)
connectDB()

const app=express()





//session middleware  
//NOTE : this should be above passport middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,  // resave=false that means we don't do anything until something is modified  
    saveUninitialized: false,  
    // cookie: { secure: true } this won't work without https
    store:new MongoStore ({
                mongooseConnection:mongoose.connection
}),
}))



//passport middleware
app.use(passport.initialize())
app.use(passport.session())


//set golbal variables
app.use(function(req,res,next){
res.locals.user=req.user||null
next()
})


//body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


//method overide middleware
//NOTE : put this code nearly top 
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))


  // login process
if(process.env.NODE_ENV==='development')
{

    app.use(morgan('dev'))  //show us status what's going on time ,locations etc 
}

//static folder use
app.use(express.static(path.join(__dirname,'static')))



//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))


//helpers handlebars
const{formatDate,
    removetags,
    truncate,
    editicon,

}=require('./helpers/hbs')


// handlebars 
app.engine('.hbs', exphbs({
helpers:{
    formatDate,
    removetags,
    truncate,
    editicon,
   
} ,   
defaultLayout:'main',
extname:'.hbs' ,
}));
app.set('view engine', '.hbs');







const PORT=process.env.PORT || 5000

app.listen(PORT,console.log(`server running in ${process.env.NODE_ENV} mode ${PORT} `))