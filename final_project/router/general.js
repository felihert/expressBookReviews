const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {  
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message:"user succesfully registered. Now you can login"});
    }
    else{
      return res.status(404).json({message:"User alrady exists"});
    }
  }
  return res.status(400).json({message: "Unable to register user, needs username and password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
  return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/axios', async function(req, res) {
  try {
    const response = await axios.get("localhost:5000/");
    const books = response.data;
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn){
    return res.send(books[isbn]);
  }
  else{
  return res.status(400).json({message: "book not found"});
  }
 });

 public_users.get('/axios/isbn/:isbn', async function(req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`localhost:5000/isbn/${isbn}`);
    const books = response.data;
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
 
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  if (author) {
    let authorBooks = [];
    for (let bookId in books) {
      let book = books[bookId];
      if (book.author === author) {
        authorBooks.push(book);
      }
    }
    if (authorBooks.length > 0) {
      return res.send(authorBooks);
    } 
    else {
      return res.status(404).json({ message: "Books by this author not found" });
    }
  } 
  else {
    return res.status(400).json({ message: "Author not specified" });
  }
});

public_users.get('/axios/author/:author', async function(req, res) {
  const author= req.params.author;
  try {
    const response = await axios.get(`localhost:5000/author/${author}`);
    const books = response.data;
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title
  if(title){
    let titleBooks = [];
    for(let bookId in books){
      let book = books[bookId]
      if (book.title == title){
        titleBooks.push(book)
      }
    }
    if(titleBooks.length > 0){
      return res.send(titleBooks);
    }
    else{
      return res.status(404).json({message:"Title not found"})
    }
  }
  else{
    return res.status(300).json({message: "Title not specified"});
  }
});

public_users.get('/axios/title/:title', async function(req, res) {
  const title= req.params.title;
  try {
    const response = await axios.get(`localhost:5000/title/${title}`);
    const books = response.data;
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(isbn){
    return res.send(books[isbn].reviews)
  }
  else{
    return res.status(400).json({message: "ISBN not found"});
  }
});

module.exports.general = public_users;
