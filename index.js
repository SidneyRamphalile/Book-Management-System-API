require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json()); //Here I want bodyParser to use JSON ONLY.
mongoose.connect(process.env.MONGO_URL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
).then(() => console.log("Connection Established"));

/*
Route               /
Description         Get all the books
Access              PUBLIC
Parameter           NONE
Methods             GET
*/ 
booky.get("/",async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
Route               /is
Description         Get specific book on ISBN
Access              PUBLIC
Parameter           isbn
Methods             GET
*/ 
booky.get("/is/:isbn", async (req,res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

        //null  !0= 1,  !1=0
        if(!getSpecificBook){
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

booky.get("/c/:category", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({category: req.params.category});

        //null  !0= 1,  !1=0
        if(!getSpecificBook){
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



//POST

// Add New Book
/*
Route               /book/new
Description         Add new books
Access              PUBLIC
Parameter           NONE
Methods             POST
*/ 
booky.post("/book/new", async(req,res) => {
    const {newBook} = req.body;   //this will fetch the body of our request (the new book we are trying to pass)
    const addNewBook = BookModel.create(newBook);
    return res.json({
        books: addNewBook,
        message: "Book was added"
    });
});

// Add New Author
/*
Route               /author/new
Description         Add new authors
Access              PUBLIC
Parameter           NONE
Methods             POST
*/ 
booky.post("/author/new", async (req, res) => {
    const { newAuthor } = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json(
        {
            author: addNewAuthor,
            message: "Author was added"
        }
    );
});


// Add New Publication
/*
Route               /publication/new
Description         Add new publications
Access              PUBLIC
Parameter           NONE
Methods             POST
*/ 
booky.post("/publication/new", async (req, res) => {
    const {newPublication} = req.body;
    const addNewPublication = PublicationModel.create(newPublication);
    return res.json(
        {
            publication: addNewPublication,
            message: "Publication was added"
        }
    );
    
});

//PUT
/*
Route               /publication/update/book
Description         Update /add new publication
Access              PUBLIC
Parameter           isbn
Methods             PUT
*/ 

booky.put("/publication/update/book/:isbn", (req, res) => {
    //Update the publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
        }
    });

    //Update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId;
            return;
        }
    });

    return res.json(
        {
            books: database.books,
            publications: database.publication,
            message: "Successfully updated publications"
        }
    );
});

/******DELETE******/
/*
Route               /book/delete
Description         Delete a book
Access              PUBLIC
Parameter           isbn
Methods             DELETE
*/ 
booky.delete("/book/delete/:isbn", (req, res) => {
    //Whichever book that does not match with the ISNB, just send it to an updatedBookDatabase array
    //and the rest will be filtered out

    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;

    return res.json({books: database.books});
});


/*
Route               /book/delete
Description         Delete an author from a book
Access              PUBLIC
Parameter           isbn (ISBN of the book)
                    authorId (ID of the author to be deleted)
Methods             DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    const isbn = req.params.isbn;
    const authorId = parseInt(req.params.authorId);

    // Find the book with the given ISBN
    const book = database.books.find((book) => book.ISBN === isbn);

    if (!book) {
        return res.json({ error: `No book found for the ISBN of ${isbn}` });
    }

    // Check if the author exists in the book's author list
    const authorIndex = book.author.indexOf(authorId);

    if (authorIndex === -1) {
        return res.json({ error: `Author with ID ${authorId} not found in the book` });
    }

    // Remove the author from the book's author list
    book.author.splice(authorIndex, 1);

    return res.json({ message: `Author with ID ${authorId} deleted from the book` });
});


/*
Route               /book/delete/author
Description         Delete an author from a book
Access              PUBLIC
Parameter           isbn, authorId
Methods             DELETE
*/ 
 booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //Update the book database
        database.books.forEach((book)=>{
            if(book.ISBN === req.params.isbn) {
                const newAuthorList = book.author.filter(
                    (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
                );
                book.author = newAuthorList;
                return;
            }
        })

    //Update the author database
        database.author.forEach((eachAuthor) => {
            if(eachAuthor.id === parseInt(req.params.authorId)) {
                const newBookList = eachAuthor.books.filter(
                    (book)=> book !== req.params.isbn
                );
                eachAuthor.books = newBookList;
                return;
            }
        });

        return res.json({
            book: database.books,
            author: database.author,
            message: "Author was deleted!!!"
        })
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





