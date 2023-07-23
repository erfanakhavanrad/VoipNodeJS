const express = require('express');
// const asterisk = require('./AsteriskAmi')
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

// let token = null
// let internalNumber = null


// app.get('/voiplogs', (req, res) => {
//     console.log(asterisk.logMessage)
//     res.send(asterisk.logMessage);
// });
// app.put('/setvariables', (req, res) => {
  
// console.log('tesst')
//     const { error } = req.body;
//     if (error) {
//         res.status(400).send(error.details[0].message);
//         return;
//     }
    
//     // console.log(req.body.token)
//     // console.log(req.body)
//     res.send('token received'); 
//     // let token = null
//     internalNumber = req.body.internalNumber;
//     token = req.body.token

// console.log(token)
// // console.log(asterisk.logMessage)
// module.exports.token = token
// module.exports.internalNumber = internalNumber
// });


//PORT ENVIRONMENT VARIABLE

const port =  8000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
