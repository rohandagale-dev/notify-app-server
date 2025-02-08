FROM node:20.18-alpine

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "node" ,"index.js" ]