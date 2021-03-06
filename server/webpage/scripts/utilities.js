function sendJson(data, url) { // JSON sender, can send pretty much any data
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', url);
    xhttp.setRequestHeader('Authorization', `Basic ${btoa(`${data.usrname}:${data.pssword}`)}`);
    xhttp.withCredentials = true;
    delete data.usrname;
    delete data.pssword;
    var final = {};
    final.name = data.title;
    delete data.title;
    final.data = data;
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(final));
}

function handleForm(data, url) { // Form logic, makes sure all data types arent undefined by searching through them for undefined
    var valid = true;
    Object.keys(data).forEach((value) => {
        if (data[value] == undefined) valid = fale;
    });
    data.usrname = getCookie('usrname');
    data.pssword = getCookie('pssword');
    if (valid) sendJson(data, url); // Send the form data
}

function setCookie(cname, cvalue, exdays) { // w3schools is amazing
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return false;
}

/*
Could probably do the form stuff with the <form> tag, but it's easier to write database code with simple json where I don't need to worry about urls. Also it makes it harder to
send unauthorized data through the url which is always a plus.
*/