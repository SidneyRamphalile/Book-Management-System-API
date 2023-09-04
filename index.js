const express = require("express");
var bodyParser = require("body-parser");

//Database
const database = require("./database");

//Initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json()); //Here I want bodyParser to use JSON ONLY.

/*
Route               /
Description         Get all the books
Access              PUBLIC
Parameter           NONE
Methods             GET
*/ 
booky.get("/", (req, res) => {
    return res.json({books: database.books});
});

/*
Route               /is
Description         Get specific book on ISBN
Access              PUBLIC
Parameter           isbn
Methods             GET
*/ 
booky.get("/is/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
        );

        if(getSpecificBook.length === 0){
            return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
        }

        return res.json({book: getSpecificBook});
});


/*
Route               /c
Description         Get specific book on category
Access              PUBLIC
Parameter           category
Methods             GET
*/ 

booky.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter(
       (book) => book.category.includes(req.params.category)
    )

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the category of ${req.params.category}`})
    }

    return res.json({book: getSpecificBook});
});


/*
Route               /lang
Description         Get specific book on language
Access              PUBLIC
Parameter           language
Methods             GET
*/ 
booky.get("/lang/:language", (req, res) => {
    const getSpecificBook = database.books.filter(
       (book) => book.language.includes(req.params.language)
    )

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the language of ${req.params.language}`})
    }

    return res.json({book: getSpecificBook});
});


/*
Route               /author
Description         Get all authors
Access              PUBLIC
Parameter           NONE
Methods             GET
*/ 
booky.get("/author", (req, res) => {
    return res.json({authors: database.author});
});


// I have to now get a SPECIFIC AUTHOR
/*
Route               /author/book/author
Description         Get all authors based on id
Access              PUBLIC
Parameter           id
Methods             GET
*/ 
booky.get("/author/book/:author", (req, res) => {
    const authorId = parseInt(req.params.author); // Convert author ID to integer
    const getSpecificAuthor = database.author.find(
        (author) => author.id === authorId
    );

    if (!getSpecificAuthor) {
        return res.json({
            error: `No author found with the ID ${authorId}`,
        });
    }

    return res.json({ author: getSpecificAuthor.name });
});


/*
Route               /author/book
Description         Get all authors based on books
Access              PUBLIC
Parameter           isbn
Methods             GET
*/ 
booky.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0){
        return res.json({ 
            error: `No author found for the book of ${req.params.isbn}` });
    }
    return res.json({authors: getSpecificAuthor})
});


/*
Route               /publications
Description         Get all publications
Access              PUBLIC
Parameter           NONE
Methods             GET
*/ 
booky.get("/publications", (req, res) => {
    return res.json({publications: database.publication});
});

//POST

// Add New Book
/*
Route               /book/new
Description         Add new books
Access              PUBLIC
Parameter           NONE
Methods             POST
*/ 
booky.post("/book/new", (req,res) => {
    const newBook = req.body;   //this will fetch the body of our request (the new book we are trying to pass)
    database.books.push(newBook); //this adds(pushes) a new book into our database
    return res.json({updatedBooks: database.books}); //return the list of books in json format
});

// Add New Author
/*
Route               /author/new
Description         Add new authors
Access              PUBLIC
Parameter           NONE
Methods             POST
*/ 
booky.post("/author/new", (req, res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json(database.author);
})


// Add New Publication
/*
Route               /publication/new
Description         Add new publications
Access              PUBLIC
Parameter           NONE
Methods             POST
*/ 
booky.post("/publication/new", (req, res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json(database.publication);
})


/*
Route               /publications/id
Description         Get all publications
Access              PUBLIC
Parameter           NONE
Methods             GET
*/ 
booky.get("/publications/:id", (req, res) => {
    const publicationId = parseInt(req.params.id); // Convert publication ID to integer
    const getSpecificPublication = database.publication.find(
        (publication) => publication.id === publicationId
    );

    if (!getSpecificPublication) {
        return res.json({
            error: `No publication found with the ID ${publicationId}`,
        });
    }

    return res.json({ publication: getSpecificPublication });
});



// Get specific publication by book ISBN
/*
Route               /publications/book/isbn
Description         Get all publications
Access              PUBLIC
Parameter           NONE
Methods             GET
*/ 
booky.get("/publications/book/:isbn", (req, res) => {
    const bookISBN = req.params.isbn;
    const getSpecificPublications = database.publication.filter(
        (publication) => publication.books.includes(bookISBN)
    );

    if (getSpecificPublications.length === 0) {
        return res.json({
            error: `No publications found for the book with ISBN ${bookISBN}`,
        });
    }

    return res.json({ publications: getSpecificPublications });
});





booky.listen(3000,() => {
    console.log("Server is up and running");
});


//VERY USEFUL NOTES TO CONSIDER:

/*
The `find()` and `filter()` methods are both array methods in JavaScript, but they serve different purposes:

1. `find()` method:
   - Purpose: It is used to find the first element in an array that satisfies a given condition (predicate function).
   - Return value: It returns the first matching element found in the array or `undefined` if no match is found.
   - Example usage: If you want to find a single specific item in an array based on a condition, you use `find()`.

2. `filter()` method:
   - Purpose: It is used to create a new array containing all elements from the original array that satisfy a given condition.
   - Return value: It returns a new array containing all matching elements. If no elements match, it returns an empty array.
   - Example usage: If you want to retrieve multiple items from an array that meet a certain condition, you use `filter()`.

I used `find()` when getting a specific publication by its ID because we are expecting only one publication to match the ID. We use `find()` to find that single publication, and it returns either the publication object or `undefined` if not found.

In contrast, for getting publications associated with a book by its ISBN, I used `filter()` because multiple publications might be associated with the same book ISBN. Using `filter()` ensures that we collect all the matching publications into an array and return them.

To summarize, `find()` is used when you expect to retrieve a single item based on a condition, and `filter()` is used when you expect to retrieve multiple items based on a condition.


*/ 





