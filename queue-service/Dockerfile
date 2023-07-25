FROM node:14

WORKDIR /usr/src/app

RUN npm i
COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "src/consumer.js"]