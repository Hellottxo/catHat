const imgElement = document.querySelector('#input');
const textureElement = document.createElement('img');
textureElement.src = './assets/hat.png';

function init() {
  document.querySelector('input').addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  });
  document.querySelector('.upload').addEventListener('click', () => {
    document.querySelector('input').click();
  })
  document.querySelector('.ware').addEventListener('click', () => {
    detectFace();
  })
}

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

/**
 * 猫脸检测
 */
function detectFace() {
  // 图片读取
  const texture = cv.imread(textureElement);
  const src = cv.imread(imgElement);
  const gray = new cv.Mat();
  // 转灰度
  cv.cvtColor(src, gray, cv.COLOR_BGR2GRAY, );
  const faceCascade = new cv.CascadeClassifier();
  // 读取模型
  faceCascade.load('face.xml');
  const faces = new cv.RectVector();
  faceCascade.detectMultiScale(gray, faces);
  for (let index = 0; index < faces.size(); ++index) {
    const item = faces.get(index);
    const dst = resize(texture, item.width / 3, item.height / 3);
    for (let i = 0; i < dst.rows; i++) {
      for (let j = 0; j < dst.cols; j++) {
        setHat(src, dst, i, j, item)
      }
    }
  }
  cv.imshow('output', src);
  src.delete();
  faceCascade.delete();
  faces.delete();
}

/**
 * 给小猫戴帽子
 */
const setHat = (src, dst, i, j, item) => {
  const {
    x,
    y,
    width
  } = item;
  const srcPixi = src.ucharPtr(i + y * 0.8, j + x + 3 * width / 8);
  const texturePixi = dst.ucharPtr(i, j);
  if (checkIsTransparent(texturePixi)) return;
  for (let index = 0; index < 4; index++) {
    // 给每个像素点设值
    srcPixi[index] = texturePixi[index];
  }
}

// 帽子透明区域不赋值
const checkIsTransparent = (texturePixi) => texturePixi[0] === 0 && texturePixi[1] === 0 && texturePixi[2] === 0 && texturePixi[3] === 0;

const Module = {
  locateFile: function (name) {
    let files = {
      'opencv_js.wasm': './assets/opencv_js.wasm'
    };
    return files[name];
  },
  preRun: [
    () => {
      Module.FS_createPreloadedFile(
        '/',
        'face.xml',
        'assets/haarcascade_frontalcatface.xml',
        true,
        false
      );
    }
  ],
  postRun: [init]
};