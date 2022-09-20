const video = document.getElementById('videoInput');
const hatElement = document.createElement('img');
hatElement.src = '../assets/hat.png';
let src
let dst
let cap
let streaming
let gray
let faces
let classifier
const FPS = 30;

document.querySelector('#start').addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream
    streaming = stream
    video.onloadedmetadata = function (e) {
      video.play();
    };
  })
  setTimeout(processVideo, 1000);

})


/**
 * 调整至指定宽高
 * @param {*} src 
 * @param {*} scale 缩放比例 
 */
 function resize(src, x, y) {
  const smallMat = new cv.Mat();
  const dsize = new cv.Size(x, y);
  cv.resize(src, smallMat, dsize, 0, 0, cv.INTER_AREA)
  return smallMat
}

const checkIsTransparent = (texturePixi) => texturePixi[0] === 0 && texturePixi[1] === 0 && texturePixi[2] === 0 && texturePixi[3] === 0;


function processVideo() {
  if (!streaming) {
    // clean and stop.
    src.delete();
    dst.delete();
    gray.delete();
    faces.delete();
    classifier.delete();
    return;
  }
  let begin = Date.now();
  // start processing.
  cap.read(src);
  src.copyTo(dst);
  cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
  // detect faces.
  classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
  const texture = cv.imread(hatElement);

  // draw faces.
  for (let i = 0; i < faces.size(); ++i) {
    const item = faces.get(i);
    const facedst = resize(texture, item.width / 3, item.height / 3);
    for (let i = 0; i < facedst.rows; i++) {
      for (let j = 0; j < facedst.cols; j++) {
        setHat(src, facedst, i, j, item)
      }
    }
  }
  cv.imshow('canvasOutput', src);
  // schedule the next one.
  let delay = 1000 / FPS - (Date.now() - begin);
  setTimeout(processVideo, delay);

};

/**
 * 给人脸戴帽子
 */
 const setHat = (src, dst, i, j, item) => {
  const {
    x,
    y,
    width
  } = item;
  console.log()
  const srcPixi = src.ucharPtr(i + y * 0.8, j + x + 3 * width / 8);
  const texturePixi = dst.ucharPtr(i, j);
  if (checkIsTransparent(texturePixi)) return;
  for (let index = 0; index < 4; index++) {
    // 给每个像素点设值
    srcPixi[index] = texturePixi[index];
  }
}


function init() {
  console.log(video.width)
  src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  cap = new cv.VideoCapture(video);
  gray = new cv.Mat();
  cap = new cv.VideoCapture(video);
  faces = new cv.RectVector();
  classifier = new cv.CascadeClassifier();
  classifier.load('face.xml');
}


const Module = {
  locateFile: function (name) {
    let files = {
      'opencv_js.wasm': '../assets/opencv_js.wasm'
    };
    return files[name];
  },
  preRun: [
    () => {
      Module.FS_createPreloadedFile(
        '/',
        'face.xml',
        '../assets/haarcascade_frontalface_default.xml',
        true,
        false
      );
    }
  ],
  onRuntimeInitialized: init
};