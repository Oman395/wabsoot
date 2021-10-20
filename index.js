import http from "http";
import { fork } from "child_process";

var delqueue = [];
var dbqueue = [];
var children = {
    deliver1: new fork('./server/deliver.js', [1]),
    deliver2: new fork('./server/deliver.js', [2]),
    db1: new fork('./server/db.js', [3]),
    db2: new fork('./server/db.js', [4]),
}
var free = {
    deliver1: false,
    deliver2: false,
    db1: false,
    db2: false,
}

const server = new http.createServer(requestHandler);

function requestHandler(req, res) {
    switch (req.method) {
        case 'GET':
            get(req, res);
            break;
        default:
            def(req, res);
            break;
    }
}

Object.keys(children).forEach((child) => {
    children[child].on("message", (message) => {
        if (message == "done") {
            free[child] = true;
        } else {
            free[child] = false;
        }
    });
});

server.listen(80, 'localhost');

function execdelQueue() {
    (async () => {
        while (true) {
            if (free.deliver1 || free.deliver2) {
                var req = delqueue[0].req;
                var res = delqueue[0].res;
                requestHandler(req, res);
            }
            await new Promise(r => setTimeout(r, 100));
        }
    });
}

function execdbQueue() {
    (async () => {
        while (true) {
            if (free.db1 || free.db2) {
                var req = delqueue[0].req;
                var res = delqueue[0].res;
                requestHandler(req, res);
            }
            await new Promise(r => setTimeout(r, 100));
        }
    });
}

function get(req, res) {
    try {
        if (free.deliver1 || free.deliver2) {
            if (free.deliver1) {
                var connector = http.request({
                    host: 'localhost',
                    port: 8081,
                    path: req.url,
                    method: req.method,
                    headers: req.headers
                }, (resp) => {
                    resp.pipe(res);
                });
                req.pipe(connector);
            } else {
                var connector = http.request({
                    host: 'localhost',
                    port: 8082,
                    path: req.url,
                    method: req.method,
                    headers: req.headers
                }, (resp) => {
                    resp.pipe(res);
                });
                req.pipe(connector);
            }
        } else {
            if (delqueue.length < 15) {
                delqueue.push({ req, res });
                execdelQueue();
            } else {
                res.writeHead(429);
                res.end()
            }
        }
    } catch (e) {
        res.writeHead(500);
        res.end;
        console.error(`======================================================
Error:
${e}`);
    }
}

function def(req, res) {
    try {
        if (free.db1 || free.db2) {
            if (free.db1) {
                var connector = http.request({
                    host: 'localhost',
                    port: 8083,
                    path: req.url,
                    method: req.method,
                    headers: req.headers
                }, (resp) => {
                    resp.pipe(res);
                });
                req.pipe(connector);
            } else {
                var connector = http.request({
                    host: 'localhost',
                    port: 8084,
                    path: req.url,
                    method: req.method,
                    headers: req.headers
                }, (resp) => {
                    resp.pipe(res);
                });
                req.pipe(connector);
            }
        } else {
            if (dbqueue.length < 15) {
                dbqueue.push({ req, res });
                execdbQueue();
            } else {
                res.writeHead(429);
                res.end()
            }
        }
    } catch (e) {
        res.writeHead(500);
        res.end;
        console.error(`======================================================
Error:
${e}`);
    }
}