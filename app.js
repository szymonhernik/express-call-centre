const express = require('express');
const http = require('http');
const sys = require('util');
const session = require('express-session')

const multer = require('multer');
const path = require('path');
const fs = require('fs'); //use the file system so we can save files
// const mongo = require('mongodb');
// const assert = require('assert');
//
// const url = 'mongodb://localhost:3000/test'

const app = express();

const port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(session({
  secret: 'picasso',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000,
    secure: false,
    httpOnly: true
  }
}));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html'); // change the path to your index.html
});


//makes the app listen for requests on port 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));


app.post('/receive', (req, res) => {
  // res.send('Hello World!')
  console.log(req.body.contents)


  // Receive the request JSON
  const incomingJSON = req.body;
  // const contentData = incomingJSON.contents;

  const session = req.sessionID.substring(0, 4)

  // Target file path
  let filePath = __dirname + `/testWrite/p-${session}.json`;

  let buf = Buffer.from(JSON.stringify(incomingJSON));


  // console.log(incomingJSON)
  // console.log(JSON.stringify(incomingJSON))
  // console.log(buf)
  // console.log(JSON.parse(buf.toString()));


  fs.writeFile(filePath, buf, 'utf8', (err) => {
    if (err) {
      throw err
    }

     res.send("success")
     console.log( JSON.parse(buf.toString()));
  });


});
