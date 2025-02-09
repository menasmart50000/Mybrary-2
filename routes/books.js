const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

const fs = require("fs");
// const multer = require("multer");
//const path = require("path");
//const uploadPath = path.join("public", Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; // Fix mime types

// no Need for multer, File pond handles it 

// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     if (imageMimeTypes.includes(file.mimetype)) {
//       callback(null, true);
//     } else {
//       callback(null, false);
//     }
//   },
// });


// New book route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// All books route
router.get("/", async (req, res) => {
    let query = Book.find()
    if(req.query.title !=null && req.query.title !=" " ){
        query = query.regex('title' , new RegExp(req.query.title,'i'));
    }
    if(req.query.publishedAfter !=null && req.query.publishedAfter !=" " ){
        query = query.lte('publishDate' , req.query.publishedAfter);
    }
    if(req.query.publishedBefore !=null && req.query.publishedBefore !=" " ){
        query = query.gte('publishDate' , req.query.publishedBefore);
    }

    try{
        const books = await Book.exec()
        res.render("books/index", {
            books: books,
            searchOptions: req.query
        })

    }
    catch{
        res.redirect("/")
    }
  
  
});



// Create new book route
router.post("/", async (req, res) => {
  const filename = req.file != null ? req.file.filename : null;

  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
    coverImageName: filename,
  });
  saveCover(book, req.body.cover)
  try {
    const newBook = await book.save();
    res.redirect(`/books/${newBook.id}`); // Fixed redirection to the correct route
  } catch (error) {
    console.error(error); 
  }
});


function saveCover(book, coverEncoded){

  if(coverEncoded == null ){
    return;
  }
  const cover  = JSON.parse(coverEncoded);
  if(cover != null && imageMimeTypes.includes(cover.type)){
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;

  } 
  


}


// books info Route

router.get("/:id", async (req,res)=>{

  try{
    const book = await Book.findById(req.params.id).populate('author').exec();

    res.render('books/show', {book: book})
  }
  catch{
        res.redirect('/')
  }
})

// edit book route 

router.get("/:id/edit", async (req,res)=>{

  try{
    const book = await Book.findById(req.params.id)
    renderEditPage(res,book)
   }
  catch (err){
    console.log(err)
        res.redirect('/')
  }
})

// UPDATE  book route
router.put("/:id", async (req, res) => {
  const filename = req.file != null ? req.file.filename : null;
  let book 
  try {
      book  = await Book.findById(req.params.id)

      book.title= req.body.title
      book.author= req.body.author
      book.publishDate= new Date(req.body.publishDate)
      book.pageCount= req.body.pageCount
      book.description= req.body.description

      if(req.body.cover != null && req.body.cover !==''){
        saveCover(book,req.body.cover)
      }
     await book.save();
    res.redirect(`/books/${book.id}`); // Fixed redirection to the correct route

  } catch {

    if (book !=null ){
      renderEditPage(res,book,true)
    }
    redirect('/')
  }
});

//DELETE BOOK Route

router.delete(':/id',async (req, res) => {

  let book

  try{
    book = await Book.findById(req.params.id)
    await book.findByIDandDelete();
    res.redirect('/books')
  }
  catch{

    if (book !=null ){

      res.render('books/show',{
      book: book,
      errorMessage: 'could not removing book'
      }
      )}
      else{
        res.redirect("/")
      } 
  }

})





// Render the "new book" page
async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, 'new', hasError);
}
// render edit page 
async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, 'edit', hasError);
}

// base function for rendering 
async function renderFormPage(res, book,form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };



    if (hasError){
      if(form == 'edit'){
        params.errorMessage = 'Error Updating book';
      }
      else{
        params.errorMessage = "Error creating book";
      }
    } 
     
    res.render(`books/${form}`, params);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.redirect("/books");
  }
}

module.exports = router;
