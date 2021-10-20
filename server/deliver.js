import fs from "fs";
import http from "http";
import mime from "mime-types";

var port = 8080 + parseInt(process.argv[2]);

const server = new http.createServer(handleRequest);

function handleRequest(req, res) {
    var response;
    var err;
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
            response = fs.readFileSync(`./server/webpage/index${process.argv[2]}.html`);
            err = 200;
        } else {
            if (fs.existsSync(`./server/webpage/404.html`)) {
                response = fs.readFileSync(`./server/webpage/404.html`);
                err = 404;
            } else {
                response = "<h1>The dev was too lazy to add a 404 message, so here we are.</h1>";
                err = 404;
            }
        }
    }
    const type = mime.lookup(response);
    res.writeHead(err, {
        'Content-Type': type,
    });
    res.end(response);
}

server.listen(port, 'localhost', () => {
    console.log(`Listenon on localhost ${port}`);
    process.send('done');
});