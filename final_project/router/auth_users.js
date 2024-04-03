const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return(user.username === username && user.password === password)
  });

  if(validusers.length>0){
    return true;
  }else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message:"Error loggin in"})
  }

  if(authenticatedUser(username,password)){
    let accessToken =  jwt.sign({
      data: password,
      username: username  // here need to specify all the info the token carries
    },"access",{expiresIn: 60*60});

    req.session.authorization={
      accessToken,username
    }
    return res.status(200).send("User successfully logged in")
  }
  else{
    return res.status(208).json({message:"Invalid Login"})
  }
});


// Add a book review
regd_users.post("/auth/review/:isbn", function auth(req,res,next){
  const isbn = req.params.isbn;
  const review = req.body.review;
  
  if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
          books[isbn].reviews[user.username]= review;
          return res.send(books[isbn])
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
});

//delete a book review
regd_users.delete("/auth/review/:isbn", function auth(req,res,next){
  const isbn = req.params.isbn;
  
  if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
          if(books[isbn].reviews[user.username]){
            delete books[isbn].reviews[user.username];
            return res.send("review deleted succesfully")
          } 
          else{
            return res.send("not reviews found")
          }
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
});







module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;






// login example: 

// post  

// localhost:5000/customer/login

// body 

// {
//   "username": "felihert",
//   "password": "password123"
// }

// {
//   "review": "good book!"
// }