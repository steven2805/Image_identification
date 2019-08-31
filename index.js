let net;
const webcamElement = document.getElementById('webcam');

async function setupwebcam(){
  return new Promise((resolve,reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia || navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia || navigatorAny.msGetUSerMedia;
    if(navigator.getUserMedia){
      navigator.getUserMedia({Video: true},
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata', () => resolve(),false);

        },
        error = reject());
    } else{
      reject();
    }
  });
}



async function app(){
  console.log('Loading mobile.net !')

  net = await mobilenet.load();
  console.log("load success");

  await setupwebcam();
  while (true){
    const result = await net.classify(webcamElement);

    document.getElementById('console').innerText = 'prediction: ${result[0].className\n probability: ${result[0].probability}';

    await tf.nextFrame();
  }

}

app()