

//The top part of this code is NOT working// const mongoose = require("mongoose");

// //create publication schema (key value pair only)
// const PublicationSchema = mongoose.Schema(
//     {
//         id: Number,
//         name: String,
//         books: [String]
//     }
// );

// const PublicationModel = mongoose.model("books",PublicationSchema); //Database name and then Schema name

// module.exports = PublicationModel;

const mongoose = require("mongoose");

// Create publication schema (key value pair only)
const PublicationSchema = mongoose.Schema(
  {
    id: Number,
    name: String,
    books: [String],
  }
);

const PublicationModel = mongoose.model("Publication", PublicationSchema);

module.exports = PublicationModel;




