FROM node:14

RUN npm i
COPY package.json package-lock.json ./
RUN npm install

WORKDIR /src
COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]