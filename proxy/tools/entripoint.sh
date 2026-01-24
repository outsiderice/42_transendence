#!/bin/sh

set -e

CERT=/certs/localhost.crt
KEY=/certs/localhost.key

if [ ! -f "$CERT" ]; then
  echo "Generating self-signed cert..."
  openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout "$KEY" \
    -out "$CERT" \
    -subj "/CN=localhost"
fi

exec nginx -g "daemon off;"
