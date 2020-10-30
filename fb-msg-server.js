try {
    var config = require('./fb-conf.json');
} catch (error) {
    console.log("Missing or badly formated ./fb-conf.json !");
    process.exit(42);
}

const https = require("https");
const fs = require("fs");
const auth = require('basic-auth')

page = fs.readFileSync("fb-msg-page.html", "utf8");
links = fs.readFileSync("links.txt", "utf8");
links = links.trim().split("\n")
links = links.map(link => encodeURIComponent(link));
console.log(links);

const options_srv = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
};

https.createServer(options_srv, function (req, res) {
    var credentials = auth(req);
    if (!credentials || credentials.name != config.basicAuth.username || credentials.pass != config.basicAuth.password) {
        res.writeHead(401, { "WWW-Authenticate": "Basic realm='osef'" });
        res.end('Access denied')
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    var page_dyn = page.replace("LINKS", JSON.stringify(links));
    res.write(page_dyn);
    res.end();
}).listen(config.port);
