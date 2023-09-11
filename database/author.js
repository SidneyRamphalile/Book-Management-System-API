
//The top part of this code is NOT working
// const mongoose = require("mongoose");

// //create author schema (key value pair only)
// const AuthorSchema = mongoose.Schema(
//     {
//         id: Number,
//         name: String,
//         books: [String]
//     }
// );

// const AuthorModel = mongoose.model("books",AuthorSchema); //Database name and then Schema name

// module.exports = AuthorModel;


const mongoose = require("mongoose");

// Create author schema (key value pair only)
const AuthorSchema = mongoose.Schema(
  {
    id: Number,
    name: String,
    books: [String],
  }
);

const AuthorModel = mongoose.model("Author", AuthorSchema); // Use "Author" as the database name

module.exports = AuthorModel;




