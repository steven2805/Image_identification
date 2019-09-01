const classifier = knnClassifier.create();
const webcamElement = document.getElementById('webcam');

let net;

async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true},
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata',  () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}



async function app() {
  console.log('Load mobilenet');
  var consoleOutput = [];
  // Load the model.
  net = await mobilenet.load();
  console.log('Success loaded model');
  
  await setupWebcam();

  const addExample = classid => {
    const activation = net.infer(webcamElement,'conv_preds');
    classifier.addExample(activation,classid);
    consoleOutput.push(classid);
    console.log(consoleOutput);
    displayconsole();
  };

// Little logger for the user 
  const displayconsole = function(){
    var html = '';
    var counter = 0;
    console.log(html);
    for(value of consoleOutput)
    {      
      if(counter == 10){
        consoleOutput.shift();
      }
      html = html + counter + ': Option selected =' + value + "\n";
      counter++;
    }
    document.getElementById('Console').innerText = html;
  }

  //Button clicky 
  document.getElementById('class-a').addEventListener('click', () => addExample(0));
  document.getElementById('class-b').addEventListener('click', () => addExample(1));
  document.getElementById('class-c').addEventListener('click', () => addExample(2));
  document.getElementById('class-d').addEventListener('click', () => addExample(3));



  while (true) {
    if(classifier.getNumClasses() > 0){
      const activation = net.infer(webcamElement,'conv_preds');
      const result = await classifier.predictClass(activation);
      const classes = ['A','B','C','D'];


    document.getElementById('Output').innerText = `
      Prediction: ${classes[result.classIndex]}\n
      Probability: ${result.confidences[result.classIndex]}
    `;


   


    





    }
    await tf.nextFrame();
  }

}

app()