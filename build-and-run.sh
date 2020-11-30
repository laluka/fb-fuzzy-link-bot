#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

echo "Generating https certs"
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem

echo "Dockerizing the world"
docker build --tag "fb-fuzzy-bot" -f Dockerfile .
docker run --restart=unless-stopped -it -v "$PWD:/app/" -p 7777:7777 -d fb-fuzzy-bot
docker ps | grep fb-fuzzy-bot
