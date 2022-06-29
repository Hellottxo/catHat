# opencv-wasm-demo

基于webassembly和opencv的猫脸识别，给小猫戴上帽子

## 启动
使用http-server或nginx启动均可
    http-server

## opencv wasm版本编译
1. 获取emsdk
    git clone https://github.com/juj/emsdk.git
    cd emsdk
    ./emsdk install latest
    ./emsdk activate latest
    source ./emsdk_env.sh

2. 将opencv编译为wasm
python ./platform/js/build_js.py build_wasm --build_wasm

3. 编译后的文件将生成在build_wasm/bin目录内,得到需要的opencv_js.wasm和opencv.js文件

4. opencv相关API参考[opencv.js](https://docs.opencv.org/3.4/d5/d10/tutorial_js_root.html)