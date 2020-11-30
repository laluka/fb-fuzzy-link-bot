FROM node:12.18

RUN npm install -g --unsafe-perm=true puppeteer forever basic-auth

WORKDIR /app

CMD [ "bash", "-c", "node fb-msg-listener.js & forever --watch fb-msg-server.js" ]