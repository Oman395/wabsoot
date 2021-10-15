var xhttp = new XMLHttpRequest();
xhttp.open('POST', '/blogdta');
xhttp.send();
xhttp.onload = function () {
    var dta = JSON.parse(xhttp.responseText);
    console.log(dta);
    var itemHolder = document.getElementById('items');
    Object.keys(dta).forEach((item, index) => {
        console.log(item);
        var data = dta[item];
        itemHolder.innerHTML += `<div class="${item}" style="border: 0.5vh solid grey; margin-top:1vh;">
        <h1 style="margin: 0; padding: 10px;">${item}</h1>
        <h2 style="margin: 0; padding: 10px;">${data.Heading}</h2>
        <p style="font-size: 80%; margin: 0; padding: 10px;">${data.Date}</p>
        <p style="margin: 0; padding: 10px;">${data.Body}</p>
        </div>
        `;
    })
}