const express = require('express');
const asterisk = require('./AsteriskAmi')
const cors = require('cors');
// import express from 'express'
// import Joi from 'Joi'
// import asterisk from './AsteriskAmi.js'
// import cors from 'cors'
// import asterisk from '../AsteriskAmi'

// const AsteriskAmi = new AsteriskAmi()
// const Joi = require('joi'); 


const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));
// console.log(asterisk.logMessage)
// const books = [
//     { title: 'Harry Potter', id: 1 },
//     { title: 'Twilight', id: 2 },
//     { title: 'Lorien Legacies', id: 3 }
// ]
let token = null
let internalNumber = null

// module.exports = function () {
//     this.name = 'GeeksforGeeks';
//     this.website = 'https://geeksforgeeks.org';
//     this.info = () => {
//       console.log(`Company name - ${this.name}`);
//       console.log(`Website - ${this.website}`);
//     }
//   }
// module.exports = {token, internalNumber}
// module.exports = function (a, b) {
//     console.log(a + b);
//   }
// //READ Request Handlers
// app.get('/', (req, res) => {
//     res.send('Welcome to Edurekas REST API with Node.js Tutorial!!');
// });

app.get('/voiplogs', (req, res) => {
    console.log(asterisk.logMessage)
    res.send(asterisk.logMessage);
});
// function getName(){
//     return 'Jim';
//   };
  

// app.get('/api/books/:id', (req, res) => {
//     const book = books.find(c => c.id === parseInt(req.params.id));

//     if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
//     res.send(book);
// });

//CREATE Request Handler
// app.post('/voiplogs', (req, res) => {

//     const { error } = req.body;
//     if (error) {
//         res.status(400).send(error.details[0].message)
//         return;
//     }
//     const book = {
//         id: books.length + 1,
//         title: req.body.title
//     };
//     books.push(book);
//     res.send(book);
// });

//UPDATE Request Handler
app.put('/setvariables', (req, res) => {
    // const book = books.find(c => c.id === parseInt(req.params.id));
    // if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!! </h2>');

    const { error } = req.body;
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    // console.log(req.body.token)
    // console.log(req.body)
    res.send('token received'); 
    // let token = null
    internalNumber = req.body.internalNumber;
    token = req.body.token

console.log(token)
// console.log(asterisk.logMessage)
module.exports.token = token
module.exports.internalNumber = internalNumber
});
// let setToken = newToken=> {	
// token = `bearer ${newToken}`
// }
// console.log(token)
// export default {setToken,token}

// //DELETE Request Handler
// app.delete('/api/books/:id', (req, res) => {

//     const book = books.find(c => c.id === parseInt(req.params.id));
//     if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;"> Not Found!! </h2>');

//     const index = books.indexOf(book);
//     books.splice(index, 1);

//     res.send(book);
// });



//PORT ENVIRONMENT VARIABLE

const port =  8000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
