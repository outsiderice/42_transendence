FROM nginx:alpine

RUN apk add --no-cache openssl

RUN mkdir certs

COPY conf/nginx.conf /etc/nginx/http.d/nginx.conf

COPY tools/entrypoint.sh /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
