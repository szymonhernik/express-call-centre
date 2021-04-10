const express = require('express');
const http = require('http');
const sys = require('util');
const router = express.Router();
import sslRedirect from 'heroku-ssl-redirect';

const path = require('path');
const fs = require('fs'); //use the file system so we can save files




//Import the mongoose module
var mongoose = require('mongoose');



const port = process.env.PORT || 8000;

const app = express();

app.use(sslRedirect());
//register view engine EJS
app.set('view engine', 'ejs')
app.set('views', 'public')




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


// Add Static files
app.use(express.static(__dirname + '/public'));

// require schema of the Reading model
const Reading = require(__dirname + '/api/models/schema.js')

app.use(express.json());


// default state array
// this array is used to contain results from the database
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
          }
          console.log('-------------------------------------------','\n');


      inReturn.contents = docs;

          console.log('Overwritten inReturn array of objects','\n');
          console.log(inReturn.contents);
          console.log('----------------------------------------------','\n');

      //Send values from the array with database values to the TEMPLATE
      res.render('index', {inReturn: inReturn.contents})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    });
})
app.get('/', function(req, res) {

  //from default page redirect to readings to call database for its contents
  res.redirect('/readings')

  // res.render('index', {inReturn: inReturn})
  // res.sendFile(__dirname + '/public/index.html');
  // change the path to your index.html



});


//makes the app listen for requests on port 3000
app.set("port", port)
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.post('/receive', (req, res) => {

  // Receive the request JSON of a recording after the button is clicked
  const incomingJSON = req.body;
  const authorData = incomingJSON.author;
  const contentData = incomingJSON.contents;

  // console.log(incomingJSON);
  // {
  //   author: 'author',
  //   contents: [ 'dzień dobry', 'Dzień dobry znowu' ]
  // }

  // USE MODEL
  const jsonSpeech = new Reading ({
    _id: new mongoose.Types.ObjectId(),
    author: authorData,
    contents: contentData
  });
  // SAVE IT IN THE DATABASE
  jsonSpeech
    .save()
    .then(result => {
      // console.log(result);
    })
    .catch(err => console.log(err))


});
