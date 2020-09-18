FROM node:10.1

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN npm run build

EXPOSE 3030

ENTRYPOINT [ "npm", "start" ]