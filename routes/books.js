const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

const fs = require("fs");
const multer = require("multer");
const path = require("path");
const uploadPath = path.join("public", Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; // Fix mime types

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    if (imageMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
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

// New book route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// Create new book route
router.post("/", upload.single('cover'), async (req, res) => {
  const filename = req.file != null ? req.file.filename : null;

  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
    coverImageName: filename,
  });

  try {
    const newBook = await book.save();
    res.redirect("/books"); // Fixed redirection to the correct route
  } catch (error) {
    console.error(error); // Log error for debugging purposes
    if (book.coverImageName != null) {
      removeBookCover(book.coverImageName);
    }
    renderNewPage(res, book, true); // Pass the book object to show form again with errors
  }
});

// Remove book cover image
function removeBookCover(filename) {
  fs.unlink(path.join(uploadPath, filename), (err) => {
    if (err) console.error(err);
  });
}

// Render the "new book" page
async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = "Error creating book";
    res.render('books/new', params);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.redirect("/books");
  }
}

module.exports = router;
