FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install typescript --save-dev

COPY . .

EXPOSE 8080

CMD ["npx", "tsc"]
