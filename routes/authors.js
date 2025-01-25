const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const author = require("../models/author");


// All Authors route 
router.get("/", async (req, res) => {
    let SearchOptions = {};
    
    if (req.query.name != null && req.query.name !== '') {
        SearchOptions.name = new RegExp(req.query.name, "i");
    }
    
    try {
        const authors = await Author.find(SearchOptions);
        res.render('authors/index', { 
            authors: authors, 
            SearchOptions: req.query 
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.redirect('/');
    }
});


// new Authors route 
router.get("/new", (req, res)=>{

    res.render('authors/new',{author:new Author()})
})
// create new author route 
router.post("/", async(req, res)=>{

    const author = new Author({

        name:req.body.name
    })

    try {
            const newAuthor = await author.save()
            res.redirect('authors')
    }
    catch{
            res.render('authors/new',{
                author:author,
                errorMessage: 'Error creating Author'
            })
    }
})



module.exports = router