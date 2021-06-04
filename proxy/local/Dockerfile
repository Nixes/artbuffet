# dockerfile for local usage, requires build step to be performed already
FROM node as build-stage
WORKDIR /app
COPY ./build/ /app/build/

FROM nginx
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY ./proxy/artstation-proxy.conf /etc/nginx/conf.d/default.conf