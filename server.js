if(process.env.NODE_ENV !== "production"){

    require('dotenv').config()
}

const express = require("express")
 const app = express()
 const expressLayouts = require("express-ejs-layouts")
 const bodyParser = require("body-parser")
 const methodOverride = require("method-override")
 app.use(methodOverride('_method')); // must comes before routes for properly method overrides 
 
 


  // routers
const indexRouter = require("./routes/index")
const AuthorsRouter = require("./routes/authors")
const BooksRouter = require("./routes/books")

 //end router


  // usage of modules 
  app.set('views', __dirname+ '/views');
  app.set('view engine', 'ejs');
  app.set('layout' , "layouts/layout")
  app.use(expressLayouts)
  app.use(bodyParser.urlencoded({limit: '10mb' ,extended:false}))
  app.use(express.json());   
  // END usage of modules 

 // Database

 const mongoose = require("mongoose");
 mongoose.connect(process.env.DATABASE_URL, {

    useNewUrlParser:true })

 const db  = mongoose.connection
 db.on("error", error => console.error(error));
 db.once("open", () => console.log("connected to mongoose!"));
 

 //Database END 


 // Cleanup 
 
//  const Book = require("./models/book"); // Adjust the path if needed
//  const Author = require("./models/author"); // Import the Author model


// async function deleteBooksWithoutAuthors() {
//     try {
        // Find books where the author reference no longer exists
//         const booksToDelete = await Book.find().populate("author");

//         let count = 0;
//         for (let book of booksToDelete) {
//             if (!book.author) { // If author is null (deleted)
//                 await Book.deleteOne({ _id: book._id });
//                 count++;
//             }
//         }

//         console.log(`Deleted ${count} books without authors.`);
//     } catch (err) {
//         console.error("Error deleting books without authors:", err);
//     } 
        
// }

// Run cleanup on server start
// deleteBooksWithoutAuthors();

// cleanup end


 
 // router usage
 app.use('/',indexRouter)
 app.use('/authors',AuthorsRouter)
 app.use('/books',BooksRouter)
 app.use(express.static("public")); // servers static public files  
 


 app.listen(process.env.PORT || 3001)

 console.log('Views directory:', app.get('views'));





