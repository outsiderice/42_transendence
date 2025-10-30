FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install typescript --save-dev

RUN npx tsc --init

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
