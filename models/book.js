
const mongoose = require('mongoose');
const author = require('./author');
//const path = require('path');

//const  coverImageBasePath = "uploads/bookCovers";

const bookSchema = new mongoose.Schema
({
     title:{type: String, required: true},
     description: {type: String, },
     publishDate: {type: Date, required: true},
     pageCount: {type: Number, required: true},
     createdAt: {type: Date, required: true, default: Date.now()},
     coverImage: {type: Buffer, required: true},
     coverImageType: {type: Buffer, required: true},
     author:{type: mongoose.Schema.Types.ObjectId, required: true, ref:"Author",},
 


});

bookSchema.virtual('coverImagepath').get(function(){
     if(this.coverImageName !=null && this.coverImageType != null){
          return  `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.to}`          
     }
});
module.exports = mongoose.model("Book",bookSchema)

bookSchema.set('toJSON', {
     virtuals: true,
   });


// module.exports.coverImageBasePath = coverImageBasePath