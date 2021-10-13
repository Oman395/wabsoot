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