# dockerfile for local usage, requires build step to be performed already
FROM nginx
COPY ./build/ /usr/share/nginx/html
COPY ./proxy/artstation-proxy.conf /etc/nginx/conf.d/default.conf