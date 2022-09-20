FROM nginx
# 这是镜像，表示拉一个nginx镜像，因为前端静态资源只需要用nginx运行，所以只拉nginx即可

COPY src/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
