FROM node:24-alpine

WORKDIR /app

RUN npm install && \
	npm i fastify

COPY . .

EXPOSE 3000

CMD ["node", "index.ts"]
