const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");







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


// new Authors route 
router.get("/new", (req, res)=>{

    res.render('authors/new',{author:new Author()})
})

// routes of view edit and delete author

//VIEW
router.get("/:id", async(req, res)=>{

    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author:author.id}).limit(6).exec()
        res.render('authors/show',{
            author: author,
            booksByAuthor: books

        })
    }
    catch{
            res.redirect("/")
    }
    
})
//EDIT

router.get('/:id/edit', async(req,res)=>{

    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit' , {author:author})

    }
    catch{
        res.redirect('/authors')
    }
   
});




// UPDATE

router.put('/:id',async(req,res)=>{
    let author
try {
     author = await Author.findById(req.params.id)
     author.name = req.body.name
     await author.save()
     res.redirect(`/authors/${author.id}`)
    
}
catch{
if(author ==null){
        res.redirect("/")
}
else{

    res.render('authors/edit',{
        author:author,
        errorMessage: 'Error Updating  Author'
    })

}
}})

//DELETE

router.delete("/:id", async (req, res) => {
    console.log("DELETE request received for ID:", req.params.id);
    try {

        
        
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) {
            console.log("Author not found");
            
        }

        await Book.deleteMany({ author: author._id });
        await Author.remove();
        console.log("Author deleted successfully");
        res.redirect("/authors");

        
    } catch (err) {
        console.error("Error deleting author:", err);
        res.redirect(`/authors/${req.params.id}`);
    }
});

 


module.exports = router