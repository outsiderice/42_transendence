# =========================================
# Stage 1: Develop the Vue.js Application
# =========================================
ARG NODE_VERSION=23.11.0-alpine

FROM node:${NODE_VERSION} AS build

# Set the working directory inside the container
WORKDIR /app

# Set environment variable to indicate development mode
ENV NODE_ENV=development

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the rest of the application source code into the container
COPY . .

# build vite app
RUN npm run build

# =========================================
# Stage 2: Runtime stage
# =========================================
FROM nginx:alpine

RUN apk add --no-cache openssl

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY conf/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY tools/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

EXPOSE 443

CMD [ "nginx", "-g", "daemon off;" ]
