
const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema
({
     name: {type: String, required: true}

});

author.Schema.pre('remove', function(next){

     Book.find({author:this.id}, (err, book) => {
          if(err){
               next(err);
          }
          else if(book.length>0){
               next(new Error("this author has books! "));
          }
          else{
               next()
          }
     })
})

module.exports = mongoose.model("Author",authorSchema) 