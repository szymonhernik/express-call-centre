let mic, recorder, soundFile;
let state = 0;
let counter =0;


let paragraphs_server, p_server 			// REFERENCES TO THE pragraph div and single paragraphs

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function(){
    document.querySelector("html").classList.add("background");

}, 800);

});

function initSite() {
  paragraphs_server = document.querySelector( '#paragraphs_server' );
  p_server = document.querySelector( '#p_server' );

}

function setup() {

  //  setting up p5.js Speech Recognition
  let lang = navigator.language || 'pl-PL';
  let speechRec = new p5.SpeechRec(lang, gotSpeech);
  let continous = true;
  let interim = false;


  // speechRec.onError = restart;
  speechRec.onEnd = restart;

  // once the record ends or an error happens, start() again. this should keep it going
  function restart(){
  	speechRec.start();
  }

  //  Function to change the content of the button
  function modifyText(new_text, element) {
    // const t2 = document.getElementById("call-button");
    element.firstChild.nodeValue = new_text;
  }

  document.getElementById("call-button").addEventListener("click", function(){
    if(this.firstChild.nodeValue =="leave your message") {
      //modifing text of the button
      modifyText("thank you", this)


      //  PASS ARRAY TO THE SERVER
      //  console.log(contents_Array);
      sendPToServer(contents_Array);

    } else if (this.firstChild.nodeValue =="Call") {
      //  modifing text of the button
      modifyText("calling", this)
      var that = this;
      setTimeout( function () {
        modifyText("leave your message", that)
      }, 3000);

      //  when button with value CALL clicked => start listening for speech recognition
      speechRec.start(continous,interim);
    }



  }, false);

  let contents_Array = [];

  function gotSpeech() {
    if(speechRec.resultValue) {
      // push the resulted string to the array
      contents_Array.push(speechRec.resultString);
      // add Paragraph to html
      let archivediv = document.querySelector(".archive")
      let p = createP(speechRec.resultString);
      p.parent( archivediv );
      console.log( p );
    }
  }
}


// send the p to the server
function sendPToServer(content){
  // Create a POST request to '/receive'
    const data = {
        author: "author",
        contents: content
    }
    console.log(data);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data)
        body: JSON.stringify(data)
    }
    // console.log(options.body)
    fetch('/receive', options);
    console.log('text is sent');
 }


 window.onload = initSite;



// y = document.body.getElementsByTagName('*'); function z() { for (i=0; i < y. length; i++) { y[i].style. fontSize = Math.random()*100+"px"; y[i].style.backgroundColor='#'+ (Math.random() *0xFFFFFF<<0).toString(16); } } setInterval(z, 0);
