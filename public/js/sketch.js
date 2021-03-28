let mic, recorder, soundFile;
let state = 0;
let counter =0;

let callButton = document.getElementById("call-button");

let paragraphs_server, p_server 			// REFERENCES TO THE pragraph div and single paragraphs


function initSite() {
  paragraphs_server = document.querySelector( '#paragraphs_server' );
  p_server = document.querySelector( '#p_server' );

}



function setup() {

  let lang = navigator.language || 'pl-PL';
  let speechRec = new p5.SpeechRec(lang, gotSpeech);

  let continous = true;
  let interim = false;

  // Function to change the content of t2
  function modifyText(new_text, element) {
    // const t2 = document.getElementById("call-button");
    element.firstChild.nodeValue = new_text;
  }

  document.getElementById("call-button").addEventListener("click", function(){
    if(this.firstChild.nodeValue =="leave your message") {
      modifyText("thank you", this)
      console.log(contents_Array);
      sendPToServer(contents_Array);

    } else if (this.firstChild.nodeValue =="Call") {
      modifyText("calling", this)
      var that = this;
      setTimeout( function () {
        modifyText("leave your message", that)
      }, 3000);

      speechRec.start(continous,interim);
    }



  }, false);

  let contents_Array = [];

  function gotSpeech() {
    if(speechRec.resultValue) {
      // push the resulted string to the array
      contents_Array.push(speechRec.resultString);
      // add Paragraph to html
      createP(speechRec.resultString);

    }
  }
}


// send the p to the server
function sendPToServer(content){
  // console.log(content);
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
// Send the image data to the server
    console.log('text is sent');
 }




 window.onload = initSite;
