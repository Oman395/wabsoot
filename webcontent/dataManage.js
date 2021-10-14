function sendDta(data, typeOf) {
    var xhttp = new XMLHttpRequest();
    console.log(data, typeOf);
    switch (typeOf) {
        case 'ADD_USER':
            console.log('Adding!');
            xhttp.open('POST', '/adduser', data.usrname);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    console.log(xhttp.responseText);
                }
            }
            xhttp.send(JSON.stringify(data));
            break;
        case 'SIGNIN':
            console.log('Signing In!');
            xhttp.open('POST', '/signin', data.usrname, data.pssword);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(data));
            xhttp.onload = function() {
                var dta = xhttp.response;
                console.log(dta);
            }
            break;
        case 'GET_USER_DTA':
            console.log('Gettin Data!');
            xhttp.open('GET', '/getdata', data.usrname, data.password);
            xhttp.send();
            xhttp.onload = function() {
                var dta = xhttp.response;
                console.log(dta);
            }
            break;
        default:
            console.error('Sorry, but the request you are attempting to make does not match any supported by our database. Please contact oranroha@gmail.com to get him to stop being lazy.');
            break;
    }
}