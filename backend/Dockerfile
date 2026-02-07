FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npx", "tsx", "watch", "src/server.ts"]
#RUN npm run build
#CMD ["npm", "start"]

