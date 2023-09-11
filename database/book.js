
//The top part of this code is NOT working
// const mongoose = require("mongoose");

// //create book schema (key value pair only)
// const BookSchema = mongoose.Schema(
//     {
//         ISBN: String,
//         title: String,
//         pubDate: String,
//         language: String,
//         numPage: Number,
//         author: [Number], //ID 1 and ID 2 (2 authors)
//         publications: [Number],
//         category: [String]
//     }
// );

// const BookModel = mongoose.model("books",BookSchema); //Database name and then Schema name

// module.exports = BookModel;


const mongoose = require("mongoose");

// Create book schema (key value pair only)
const BookSchema = mongoose.Schema(
  {
    ISBN: String,
    title: String,
    pubDate: String,
    language: String,
    numPage: Number,
    author: [Number], // ID 1 and ID 2 (2 authors)
    publications: [Number],
    category: [String],
  }
);

const BookModel = mongoose.model("Book", BookSchema);

module.exports = BookModel;


