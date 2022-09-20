!/bin/bash

performanceStart() {
	timeStart=`date +%s`
}

performanceEnd() {
	timeEnd=`date +%s`
	second=`expr $timeEnd - $timeStart`
	echo "deploy done, total time ${second}s"
}

IMAGE_NAME="dockervue"    # 镜像名
CONTAINER_NAME="vueApp" # 容器名
EXTERNAL_PORT="8080" # 暴露出端口

performanceStart

docker stop $CONTAINER_NAME # 停止原来容器
docker rm $CONTAINER_NAME # 删除原来容器
docker rmi $IMAGE_NAME # 删除原来镜像

# 构建镜像，此命令会执行Dockfile文件。
注意后面有个点（.），网上也很多文章说明，我觉得此处不会被忽略
docker build -t $IMAGE_NAME .

# 运行Docker容器，暴露出端口
docker run -p ${EXTERNAL_PORT}:80 -d --name $CONTAINER_NAME $IMAGE_NAME

performanceEnd
