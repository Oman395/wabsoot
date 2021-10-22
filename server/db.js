import db from "quick.db";
import http from "http";


var port = 8080 + parseInt(process.argv[2]);

const server = new http.createServer(handleRequest);

function handleRequest(req, res) {
    try {
        var header = req.headers.authorization || '';
        var token = header.split(/\s+/).pop() || '';
        var auth = Buffer.from(token, 'base64').toString();
        auth = auth.split(':');
        auth = { usrname: auth[0], pssword: auth[1] };
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = JSON.parse(body);
            if (auth && checkCreds(auth, post.name)) {
                switch (req.method) {
                    case 'POST':
                        if (req.url == '/account?create' && !db.get(post.name)) {
                            db.set(post.name, post.data);
                        } else if (req.url == '/account?create') {
                            res.writeHead(401);
                            res.end();
                            return;
                        } else {
                            if (post.data.newBlog) {
                                db.push('entries', post.name);
                                post.data.date = new Date();
                                delete post.data.newBlog;
                            }
                            db.set(post.name, post.data);
                        }
                        break;
                    case 'PUT':
                        db.push(post.name, post.data);
                        break;
                    case 'DELETE':
                        db.delete(post.name);
                        break;
                }
                res.writeHead(200);
                res.end('Success!');
            } else {
                res.writeHead(403, { "Content-Type": "text/plain" });
                res.end('Invalid');
            }
        });
    } catch (e) {
        res.writeHead(500);
        res.end;
        console.error(`======================================================
Error:
${e}`);
    }
}

var checkCreds = function (creds, item) {
    var user = db.get(creds.usrname);
    if (user && user.pssword == creds.pssword) {
        if (user.access == "Owner") {
            return true;
        } else if (user.access.includes(item)) {
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

server.listen(port, 'localhost', () => {
    console.log(`Listenon on localhost ${port}`);
    process.send('done');
});