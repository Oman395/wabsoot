var xhttp = new XMLHttpRequest();
xhttp.open('POST', '/getblogs');
xhttp.setRequestHeader('Content-Type', 'application/json');
var args = {
    'blogIndex': 0,
};
var index;
var count;
xhttp.addEventListener('loadend', () => {
    var data = JSON.parse(xhttp.response);
    var active = document.getElementById('content');
    Object.keys(data).forEach((entry) => {
        if (entry != 'count') {
            var div = document.createElement("div");
            div.id = entry;
            div.innerHTML = `<p class="title">${entry}</p>
        <p class="date">${data[entry].date}</p>
        <p class="subtitle">${data[entry].header}</p>
        <p class="body">${data[entry].body}</p>`;
            active.appendChild(div);
        }
    });
    count = data.count;
    var first = document.createElement('button');
    first.innerHTML = 'First';
    first.id = 'first';
    first.onclick = gotoFirst;
    active.appendChild(first);
    if (args.blogIndex - 5 >= 0) {
        index = args.blogIndex - 5;
        var button = document.createElement('button');
        button.innerHTML = 'Previous';
        button.id = 'prev';
        button.onclick = updateContent;
        active.appendChild(button);
    }
    if (args.blogIndex + 5 < data.count) {
        index = args.blogIndex + 5;
        var button = document.createElement('button');
        button.innerHTML = 'Next';
        button.id = 'next';
        button.onclick = updateContent;
        active.appendChild(button);
    }
    var last = document.createElement('button');
    last.innerHTML = 'Last';
    last.id = 'last';
    last.onclick = gotoLast;
    active.appendChild(last);
})

function updateContent() {
    document.getElementById('content').innerHTML = "";
    args = {
        'blogIndex': index
    };
    console.log(args);
    xhttp.open('POST', '/getblogs');
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(args));
}

function gotoFirst() {
    index = 0;
    updateContent();
}

function gotoLast() {
    index = count - count % 5;
    updateContent();
}

xhttp.send(JSON.stringify(args));