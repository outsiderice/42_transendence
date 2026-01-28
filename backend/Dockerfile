FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

#CMD ["npx", "tsx", "watch", "src/server.ts"]
CMD ["npm", "build"]

