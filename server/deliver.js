import fs from "fs";
import http from "http";
import mime from "mime-types";
import db from "quick.db";

var port = 8080 + parseInt(process.argv[2]);

const server = new http.createServer(handleRequest);

function handleRequest(req, res) {
    try {
        var response;
        var err;
        if (req.url.split('?').length <= 1) {
            if (fs.existsSync(req.url != "/" && `./server/webpage${req.url}`) || fs.existsSync(`./server/webpage${req.url}.html`)) {
                if (fs.existsSync(`./server/webpage${req.url}.html`)) {
                    response = fs.readFileSync(`./server/webpage${req.url}.html`);
                    err = 200;
                } else {
                    response = fs.readFileSync(`./server/webpage${req.url}`);
                    err = 200;
                }
            } else {
                if (req.url == "/") {
                    response = fs.readFileSync(`./server/webpage/index.html`);
                    err = 200;
                } else {
                    console.log(extras.hasOwnProperty(req.url.split('?')[0]));
                    if (fs.existsSync(`./server/webpage/404.html`)) {
                        response = fs.readFileSync(`./server/webpage/404.html`);
                        err = 404;
                    } else {
                        response = "<h1>The dev was too lazy to add a 404 message, so here we are.</h1>";
                        err = 404;
                    }
                }
            }
        } else {
            console.log(req.url);
            var args = req.url.split('?')[1].split("=");
            var dta = { [args[0]]: args[1] };
            var pages = db.get('entries');
            pages.reverse();
            var index = dta.page * 5;
            var ret = {};
            for (var i = index; i < Math.min(pages.length, index + 5); i++) {
                var act = db.get(pages[i]);
                ret[pages[i]] = act;
            }
            ret.count = pages.length;
            response = JSON.stringify(ret);
            err = 200;
        }
        const type = mime.lookup(response);
        res.writeHead(err, {
            'Content-Type': type,
        });
        res.end(response);
    } catch (e) {
        res.writeHead(500);
        res.end;
        console.error(`======================================================
Error:
${e}`);
    }
}

server.listen(port, 'localhost', () => {
    console.log(`Listenon on localhost ${port}`);
    process.send('done');
});