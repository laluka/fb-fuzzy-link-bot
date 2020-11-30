# fb-fuzzy-link-bot

Welcome to fb-fuzzy-link-bot!

![WebUI](./images/webUI.png)

This project is composed of three main components: 

1. fb-msg-listener.js // Puppeteer bot to poll for new messages with your facebook account
1. fb-msg-server.js   // A simple webUI with fuzzy-find (fusejs) to get links
1. fb-conf.json       // messengerURL (1), ThreadID (2 base64-decoded), basic auth credentials, listening port

![Config from devtools](./images/config.png)


## Setup

```bash
npm i puppeteer forever basic-auth
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
# Export your messenger.com cookies with Cookie-Editor (the format smoothly with puppeteer)
# https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm
# Place the json in cookies.json
```

## Example fb-conf.json

```
{
    "messengerUrl": "https://www.messenger.com/t/XXXXXXXXXXXXXXXX",
    "threadFbId": "XXXXXXXXXXXXXXXX",
    "port": 8000,
    "basicAuth": {
        "username": "dummy_user",
        "password": "dummy_pass"
    }, 
    "debug": false
}
```


## Run

```bash
forever --watch fb-msg-server.js
node fb-msg-listener.js
```

## What about docker ?

Yeah, sure :)

```bash
./build-and-run.sh
```


## Contribute

Of course contributions are _always_ welcome, feel free to fork, tweak, and submit a PR ! :)

