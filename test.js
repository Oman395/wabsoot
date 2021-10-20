import http from "http";

const options = {
    hostname: 'localhost',
    port: 80,
    path: '/',
    method: 'GET'
}
function requ() {
    try {
        console.log('Request');
        var req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            requ();
            requ();
        })
        req.end();
    } catch {
        requ();
    }
}
try {
    requ();
} catch {
    requ();
}