const video = document.getElementById('cameraStream');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

function analyzeFrame() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const imageData = canvas.toDataURL('image/png');
  sendImageToServer(imageData);

  setTimeout(analyzeFrame, 500);
}

function sendImageToServer(imageData) {
  fetch('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageData })
  })
  .then(response => response.json())
  .then(data => {
    if (data.cardIdentified) {
      displayCardInfo(data);
    }
  });
}

analyzeFrame();
