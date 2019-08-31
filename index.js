let net;

async function app(){
  console.log('Loading mobile.net !')

  net = await mobilenet.load();
  console.log("load success");

  const imgEL = document.getElementById('img')
  const result = await net.classify(imgEL)
  console.log(result) 
}

app()