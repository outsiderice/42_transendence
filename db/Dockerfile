FROM node:22

WORKDIR /app

RUN apt update && apt install sqlite3 

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

#CMD ["npx", "tsx", "watch", "src/server.ts"]
CMD ["npm", "build"]
