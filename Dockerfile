FROM node:12.18.3

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN npm run build

EXPOSE 8081

ENTRYPOINT [ "npm", "start" ]