const https = require('https');
const fs = require('fs');
const db = require('quick.db');
const mimetype = require('mime-types');
const options = {
    cert: fs.readFileSync('./keys/certificate.crt'),
    key: fs.readFileSync('./keys/private.key'),
}
const server = new https.createServer(options, handleRequest).listen(443, '192.168.1.178');
server.on('listening', () => {
    console.log("Listening :D");
});

function handleRequest(req, res) {
    var mime = mimetype.lookup(req.url);
    console.log(req.url, mime);
    if (req.method != "POST") {
        if (mime) {
            if (fs.existsSync(`./webcontent${req.url}`)) {
                res.writeHead(200, {
                    'Content-Type': mime,
                });
                res.end(fs.readFileSync(`./webcontent${req.url}`));
            } else {
                res.writeHead(404, {
                    'Content-Type': 'text/html',
                });
                res.end(fs.readFileSync(`./webcontent/404/index.html`));
            }
        } else {
            if (fs.existsSync(`./webcontent/${req.url}`)) {
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                });
                res.end(fs.readFileSync(`./webcontent/${req.url}/index.html`));
            } else if (req.url == '/') {
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                });
                res.end('./webcontent/index.html');
            } else {
                res.writeHead(404, {
                    'Content-Type': 'text/html',
                });
                res.end(fs.readFileSync(`./webcontent/404/index.html`));
            }
        }
    } else if (req.url == '/getdata') {
        console.log('gettin data')
        var body = '';

        req.on('data', function(data) {
            body += data;
            if (body.length > 1e6)
                request.connection.destroy();
        });

        req.on('end', function() {
            console.log(body);
            var dta = JSON.parse(body);
            try {
                if (db.get(dta.usrname) && db.get(`${dta.username}.pssword`) == dta.password) {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end(db.get(dta.username));
                } else {
                    res.writeHead(404, {
                        'Content-Type': 'text/plain',
                    });
                    res.end('Invalid user/user not found!');
                }
            } catch {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('User data invalid!');
            }
        });
    } else if (req.url == '/adduser') {
        var body = '';

        req.on('data', function(data) {
            body += data;
            if (body.length > 1e6)
                request.connection.destroy();
        });
        req.on('end', function() {
            var dta = JSON.parse(body);
            console.log(dta);
            db.set(dta.usrname, {
                fname: dta.fname,
                lname: dta.lname,
                pssword: dta.pssword,
            });
        });
    } else {
        var body = '';

        req.on('data', function(data) {
            body += data;
            if (body.length > 1e6)
                request.connection.destroy();
        });

        req.on('end', function() {
            var dta = JSON.parse(body);
            try {
                db.set(dta.usrname, {
                    fname: dta.fname,
                    lname: dta.lname,
                    pssword: dta.password,
                });
                console.log(db.get(dta.usrname));
                res.writeHead(200);
                res.end();
            } catch {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                })
                res.end('User data invalid!');
            }
        });
    }
}