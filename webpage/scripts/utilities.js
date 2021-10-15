function sendJson(data, url) {
    var xhttp = new XMLHttpRequest();
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.open('POST', url);
    xhttp.send(JSON.stringify(data));
}

function handleForm(data, url) {
    var valid = true;
    Object.keys(data).forEach((value) => {
        if (value == undefined) valid = fale;
    });
    if (valid) sendJson(data, url);
}