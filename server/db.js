import db from "quick.db";
import http from "http";


var port = 8080 + parseInt(process.argv[2]);

const server = new http.createServer(handleRequest);

function handleRequest(req, res) {
    console.log(req.url);
    var header = req.headers.authorization || '';
    var token = header.split(/\s+/).pop() || '';
    var auth = Buffer.from(token, 'base64').toString();
    console.log(auth);
    auth = auth.split(':');
    auth = { usrname: auth[0], pssword: auth[1] };
    console.log(auth);
    var body = '';
    req.on('data', function (data) {
        body += data;
        console.log(body);
        if (body.length > 1e6)
            req.connection.destroy();
    });

    req.on('end', function () {
        var post = JSON.parse(body);
        console.log(post);
        if (auth && checkCreds(auth, post.name)) {
            console.log('Authorized');
            console.log(req.method);
            switch (req.method) {
                case 'POST':
                    db.set(post.name, post.data);
                    console.log(db.get(post.name));
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
            console.log('Auth failed!');
            res.writeHead(403, { "Content-Type": "text/plain" });
            res.end('Invalid');
        }
    });
}

var checkCreds = function (creds, item) {
    console.log(creds, item);
    console.log(db.get(creds.usrname));
    var user = db.get(creds.usrname);
    if (user && user.pssword == creds.pssword) {
        if (user.access == "Owner") {
            return true;
        } else if (user.access.includes(item)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

server.listen(port, 'localhost', () => {
    console.log(`Listenon on localhost ${port}`);
    process.send('done');
});