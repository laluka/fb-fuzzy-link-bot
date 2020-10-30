try {
    var cookies = require('./cookies.json');
} catch (error) {
    console.log("Missing or badly formated ./cookies.json !");
    console.log("Export with https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm");
    process.exit(42);
}

try {
    var config = require('./fb-conf.json');
} catch (error) {
    console.log("Missing or badly formated ./fb-conf.json !");
    process.exit(42);
}

const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
    const browser = await puppeteer.launch({
        // args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"], // for debian...
        devtools: config.debug,
        headless: !config.debug
    });
    page = (await browser.pages())[0];
    await page.setCookie(...cookies)
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(config.messengerUrl);
    cdp_session = await page.target().createCDPSession();
    await cdp_session.send('Network.enable');
    await cdp_session.send('Page.enable');
    const handleWebSocketFrameReceived = (params) => {
        const payload = params.response.payloadData;
        var data = Buffer.from(payload, 'base64').toString('utf-8');
        try {
            // console.log(data);
            var matchs = data.match(/\{"deltas.*\}/);
            if (matchs === null) { return }
            match = matchs[0];
            json_blob = JSON.parse(match);
            json_blob.deltas.forEach(delta => {
                if (delta.class != "NewMessage") { return }
                if (delta.body === undefined) { return }
                if (delta.messageMetadata.threadKey.threadFbId != config.threadFbId) { return }
                console.log("body:", delta.body);
                links = delta.body.match(/\bhttps?:\/\/\S+/gi);
                if (links === null) { return }
                console.log("links:", links);
                var unique_links = [...new Set(links)];
                unique_links.forEach(link => {
                    console.log("Adding link:", link);
                    fs.appendFileSync('links.txt', link + "\n");
                });
            });
        } catch (error) {
            // console.log(error);
            return
        }
    }
    cdp_session.on('Network.webSocketFrameReceived', handleWebSocketFrameReceived);

    // await browser.close();
})();
