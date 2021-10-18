const fs = require('fs');
const https = require('https');
const db = require('quick.db');
const mime = require('mime-types');
const basicAuth = require('basic-auth');

const options = {
    key: fs.readFileSync('./keys/private.key'),
    cert: fs.readFileSync('./keys/certificate.crt'),
}

var server = new https.createServer(options, handleRequest);

server.listen(443, '192.168.1.178');

function handleRequest(req, res) {
    try {
        switch (req.method) {
            case 'POST':
                post(req, res);
                break;
            case 'GET':
                get(req, res);
                break;
            default:
                other(req, res);
                break;
        }
    } catch (e) {
        if (res && req) {
            console.error(`======================================================================
ERROR:
${e}`);
            res.writeHead(500);
            res.end();
        }
    }
}

// Sets up the file, if it has no file type default to html, make sure it exist and such, pretty simple

function getFile(url, callback) {
    try {
        if (fs.existsSync(`./webpage${url}`) || fs.existsSync(`./webpage${url}.html`)) {
            var type = mime.lookup(url);
            if (type) {
                callback({
                    valid: true,
                    mime: type,
                    body: fs.readFileSync(`./webpage${url}`),
                    errCode: 200,
                });
            } else if (url != "/") {
                callback({
                    valid: true,
                    mime: 'text/html',
                    body: fs.readFileSync(`./webpage${url}.html`),
                    errCode: 200,
                });
            } else {
                callback({
                    valid: true,
                    mime: 'text/html',
                    body: fs.readFileSync(`./webpage/index.html`),
                    errCode: 200,
                });
            }
        } else {
            callback({
                valid: false,
                mime: 'text/html',
                errCode: 404,
            });
        }
    } catch (e) {
        console.error(`======================================================================
ERROR:
${e}`);
        callback({
            valid: false,
            mime: 'text/plain',
            errCode: 500,
        });
    }
}

// Handle post request, gather data then send it to handler

function post(req, res) {
    try {
        var body = '';
        req.on('data', function(data) {
            body += data;
            if (body.length > 1e6)
                request.connection.destroy();
        });
        req.on('end', function() {
            if (body) {
                try {
                    var data = JSON.parse(body);
                    handleData(data, res, req, req.url);
                } catch {
                    console.error(``)
                    res.writeHead(400);
                    res.end();
                }
            } else {
                console.error(`======================================================================
Bad request from client! Probably their fault though.`)
                res.writeHead(400);
                res.end();
            }
        });
    } catch (e) {
        if (res && req) {
            console.error(`======================================================================
ERROR:
${e}`);
            res.writeHead(500);
            res.end();
        }
    }
}

// Handle get request, get data from getFile then send to user

function get(req, res) {
    try {
        var url = req.url;
        getFile(url, (data) => {
            if (data.valid) {
                res.writeHead(200, {
                    'Content-Type': data.mime,
                });
                res.end(data.body);
            } else if (data.errCode != 404) {
                res.writeHead(data.errCode);
                res.end();
            } else {
                res.writeHead(data.errCode, data.mime);
                res.end(fs.readFileSync('./webpage/404.html'));
            }
        });
    } catch (e) {
        if (res && req) {
            console.error(`======================================================================
ERROR:
${e}`);
            res.writeHead(500);
            res.end();
        }
    }
}

// Pretty much just another get handler, might merge get and other

function other(req, res) {
    try {
        var url = req.url;
        getFile(url, (data) => {
            if (data.valid) {
                res.writeHead(200, {
                    'Content-Type': data.mime,
                });
                res.end(data.body);
            } else {
                res.writeHead(data.errCode);
                res.end();
            }
        });
    } catch (e) {
        if (res && req) {
            console.error(`======================================================================
ERROR:
${e}`);
            res.writeHead(500);
            res.end();
        }
    }
}

// Data handler, prob gonna make my own headers for JSON data for the function to run, then tell final function what to do (with 'failed' variable)

function handleData(data, res, req, url) {
    try {
        var failed = false;
        var admin = JSON.parse(fs.readFileSync('./admin.json'));
        switch (url) {
            case '/sendblog':
                var user = basicAuth(req);
                if (data.title && data.header && data.body && user.name == admin.usrname && user.pass == admin.pssword) {
                    db.set(data.title, {
                        header: data.header,
                        body: data.body,
                        date: new Date(),
                    });
                    db.push('entries', data.title);
                    console.log(`======================================================================
New blog entry!
${data.title}
${new Date()}
${data.header}
${data.body}`);
                    res.writeHead(201);
                    res.end();
                } else if (data.title && data.header && data.body && data.usrname && data.pssword) {
                    res.writeHead(401);
                    res.end();
                } else {
                    res.writeHead(400);
                    res.end();
                }
                break;
            case '/getblogs':
                var blogs = db.get('entries');
                var retData = {};
                blogs = blogs.reverse();
                for (var i = data.blogIndex; i < Math.min(data.blogIndex + 5, blogs.length); i++) {
                    var active = blogs[i];
                    var actData = db.get(active);
                    actData.body = actData.body.replaceAll("\n", "<br>");
                    retData[active] = actData;
                }
                retData.count = blogs.length;
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify(retData));
                break;
        }
        if (!failed) {
            res.writeHead(201);
            res.end();
        } else {
            res.writeHead(400);
            res.end();
        }
    } catch (e) {
        if (res && req) {
            console.error(`======================================================================
ERROR:
${e}`);
            res.writeHead(500);
            res.end();
        }
    }
}