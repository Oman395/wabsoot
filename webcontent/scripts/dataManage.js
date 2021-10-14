function sendDta(data, typeOf) {
    var xhttp = new XMLHttpRequest();
    console.log(data, typeOf);
    switch (typeOf) {
        case 'ADD_USER':
            console.log('Adding!');
            xhttp.open('POST', '/adduser', data.usrname);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    console.log(xhttp.responseText);
                    document.cookie = `usrname=${data.usrname};pssword=${data.pssword}`;
                    console.log(docuemnt.cookie);
                } else if (xhttp.status == 500) {
                    console.log('Invalid!');
                }
            }
            xhttp.send(JSON.stringify(data));
            break;
        case 'SIGNIN':
            console.log('Signing In!');
            xhttp.open('POST', '/signin', data.usrname, data.pssword);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(data));
            xhttp.onload = function () {
                if (xhttp.status == 406) {
                    console.log('Fail.');
                    window.location.href = "/account";
                } else {
                    console.log('Success!');
                    console.log(document.cookie);
                    document.cookie = `usrname=${data.usrname};`;
                    document.cookie = `pssword=${data.pssword}`;
                    console.log(document.cookie);
                }
            }
            break;
        case 'GET_USER_DTA':
            console.log('Gettin Data!');
            xhttp.open('GET', '/getdata', data.usrname, data.password);
            xhttp.send();
            xhttp.onload = function () {
                var dta = xhttp.response;
                console.log(dta);
            }
            break;
        default:
            console.error('Sorry, but the request you are attempting to make does not match any supported by our database. Please contact oranroha@gmail.com to get him to stop being lazy.');
            break;
    }
}