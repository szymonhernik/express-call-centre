const express = require('express');
const http = require('http');
const sys = require('util');
const session = require('express-session')
const router = express.Router();

const path = require('path');
const fs = require('fs'); //use the file system so we can save files

//Import the mongoose module
var mongoose = require('mongoose');



const app = express();

//register view engine
app.set('view engine', 'ejs')
app.set('views', 'public')


const port = process.env.PORT || 8000;


// mongoose.connect('mongodb+srv://net-user:test1234@call-center.mprpi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

// Set up mongoose connection
var dev_db_url = 'mongodb+srv://net-user:test1234@call-center.mprpi.mongodb.net/Speech?retryWrites=true&w=majority'
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(
  dev_db_url,

   {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);



app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname + '/api'));

const Reading = require(__dirname + '/api/models/schema.js')

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

const inReturn = [
  {contents: "x"}
]

app.get("/readings", (req,res,next)=> {
  Reading.find()
    .exec()
    .then(docs => {
      console.log('-------------------------------------------');
      console.log('The results of database GET/readings', '\n');
      for (var i = 0; i < docs.length; i++) {
        console.log( docs[i].contents)
        // for (var i = 0; i < docs[i].contents.length; i++) {
        //   // console.log(${docs[i].contents[i]});
        // }
      }
      console.log('-------------------------------------------','\n');


      inReturn.contents = docs;

      console.log('Overwritten inReturn array of objects','\n');
      console.log(inReturn.contents);
      console.log('----------------------------------------------','\n');
      // console.log("this is docs------"+docs+"------end of docs");
      res.render('index', {inReturn: inReturn.contents})
      // res.status(200).json(docs)
      // res.render('reading', {inReturn: inReturn})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    });
})
app.get('/', function(req, res) {

  res.redirect('/readings')

  // res.render('index', {inReturn: inReturn})
  // res.sendFile(__dirname + '/public/index.html');
  // change the path to your index.html



});


//makes the app listen for requests on port 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));


app.post('/receive', (req, res) => {
  // res.send('Hello World!')
  // console.log(req.body.contents)


  // Receive the request JSON
  const incomingJSON = req.body;
  const authorData = incomingJSON.author;
  const contentData = incomingJSON.contents;

  // console.log(incomingJSON);
  // {
  //   author: 'author',
  //   contents: [ 'dzień dobry', 'Dzień dobry znowu' ]
  // }
  const jsonSpeech = new Reading ({
    _id: new mongoose.Types.ObjectId(),
    author: authorData,
    contents: contentData
  });

  jsonSpeech
    .save()
    .then(result => {
      // console.log(result);
    })
    .catch(err => console.log(err))

  const session = req.sessionID.substring(0, 4)

  // Target file path
  let filePath = __dirname + `/public/testWriter/p-${session}.json`;

  let buf = Buffer.from(JSON.stringify(incomingJSON));

  fs.writeFile(filePath, buf, 'utf8', (err) => {
    if (err) {
      throw err
    }

     res.send("success")
     // console.log( JSON.parse(buf.toString()));
  });


});
