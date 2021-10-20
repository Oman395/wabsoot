function sendJson(data, url) { // JSON sender, can send pretty much any data
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', url);
    console.log(`usrname:${data.usrname};pssword:${data.pssword}`);
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
    if (valid) sendJson(data, url); // Send the form data
}

/*
Could probably do the form stuff with the <form> tag, but it's easier to write database code with simple json where I don't need to worry about urls. Also it makes it harder to
send unauthorized data through the url which is always a plus.
*/