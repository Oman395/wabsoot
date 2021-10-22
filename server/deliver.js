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
            switch (req.url.split('?')[1].split('=')[0]) {
                case 'page':
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
                    break;
                case 'login':
                    var header = req.headers.authorization || '';
                    var token = header.split(/\s+/).pop() || '';
                    var auth = Buffer.from(token, 'base64').toString();
                    auth = auth.split(':');
                    auth = { usrname: auth[0], pssword: auth[1] };
                    if (checkCreds(auth)) {
                        err = 200;
                        response = "success";
                    } else {
                        err = 403;
                        response = "fail";
                    }
                    break;
                case 'create':
                    var header = req.headers.authorization || '';
                    var token = header.split(/\s+/).pop() || '';
                    var auth = Buffer.from(token, 'base64').toString();
                    auth = auth.split(':');
                    auth = { usrname: auth[0], pssword: auth[1] };
                    if (auth.usrname && auth.pssword) {
                        db.set(auth.usrname, { pssword: auth.pssword, access: 'user' });
                        err = 201;
                        response = "success";
                    } else {
                        err = 401;
                        response = "fail";
                    }
                    break;
                default:
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
                            if (fs.existsSync(`./server/webpage/404.html`)) {
                                response = fs.readFileSync(`./server/webpage/404.html`);
                                err = 404;
                            } else {
                                response = "<h1>The dev was too lazy to add a 404 message, so here we are.</h1>";
                                err = 404;
                            }
                        }
                    }
            }
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

var checkCreds = function (creds, item) {
    var user = db.get(creds.usrname);
    if (user && user.pssword == creds.pssword) {
        if (user.access == "Owner") {
            return true;
        } else if (user.access.includes(item) || !item) {
            return true;
        } else {
            console.log(`======================================================
Attempt to authenticate with invalid credentials made!
Username: ${creds.usrname}, Password: ${creds.pssword}.`);
            return false;
        }
    } else {
        console.log(`======================================================
Attempt to authenticate with invalid credentials made!
Username: ${creds.usrname}, Password: ${creds.pssword}.`);
        return false;
    }
}