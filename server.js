if(process.env.NODE_ENV !== "production"){

    require('dotenv').config()
}


const express = require("express")
 const app = express()
 const expressLayouts = require("express-ejs-layouts")

 // Database

 const mongoose = require("mongoose");
 mongoose.connect(process.env.DATABASE_URL, {

    useNewUrlParser:true })

 const db  = mongoose.connection
 db.on("error", error => console.error(error));
 db.once("open", () => console.log("connected to mongoose!"));
 

 //Database END 



 // routers
const indexRouter = require("./routes/index")

 //end router

 app.set('views', __dirname+ '/views');
 app.set('view engine', 'ejs');
 app.set('layout' , "layouts/layout")
 app.use(expressLayouts)
 app.use(express.static('public'))
 app.use('/',indexRouter)


 app.listen(process.env.PORT || 3001)

 console.log('Views directory:', app.get('views'));
