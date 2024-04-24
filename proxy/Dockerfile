FROM node:20 as build-stage
WORKDIR /app
COPY ./package.json ./package-lock.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build
RUN rm /app/node_modules -R

FROM nginx
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY ./proxy/artstation-proxy.conf /etc/nginx/conf.d/default.conf