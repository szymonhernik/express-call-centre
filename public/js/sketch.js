let mic, recorder, soundFile;
let state = 0;

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
    if(this.firstChild.nodeValue =="calling") {
      modifyText("thank you bye", this)

    } else if (this.firstChild.nodeValue =="Call") {
      modifyText("calling", this)
      speechRec.start(continous,interim);
    }


  }, false);




  function gotSpeech() {
    if(speechRec.resultValue) {
      // console.log(speechRec.resultString);
      //pass resulted string to the function
      sendPToServer(speechRec.resultString);
      createP(speechRec.resultString);

    }
    // console.log(speechRec);
  }

}

// send the p to the server
function sendPToServer(content){
  console.log(content);
 // Create a POST request to '/receive'
    const data = {
        author: "author",
        contents: content
    }

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






 let paragraphs_server, p_server, 			// REFERENCES TO THE pragraph div and single paragraphs

 function initSite( ) {

  paragraphs_server = document.querySelector( '#paragraphs_server' );
 	p_server = document.querySelector( '#p_server' );

  fetch( '/receive/p-4FnC.json' )

 		.then( res => res.json( ) )
 		.then( ( out ) => {
 			let results = out.contents;

 			if ( results )
 			  p_server.innerText = results
 		} );

 }

 window.onload = initSite;
