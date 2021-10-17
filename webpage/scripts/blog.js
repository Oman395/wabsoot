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
        <p class="date">${new Date(data[entry].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${new Date(data[entry].date).toLocaleDateString()}</p>
        <p class="subtitle">${data[entry].header}</p>
        <p class="body">${data[entry].body}</p>`;
            active.appendChild(div);
        }
    });
    count = data.count;
    var first = document.createElement('button');
    first.innerHTML = 'Latest';
    first.id = 'first';
    first.onclick = gotoFirst;
    active.appendChild(first);
    index = args.blogIndex;
    if (args.blogIndex - 5 >= 0) {
        var button = document.createElement('button');
        button.innerHTML = 'Previous';
        button.id = 'prev';
        button.onclick = prev;
        active.appendChild(button);
    }
    if (args.blogIndex + 5 < data.count) {
        var button = document.createElement('button');
        button.innerHTML = 'Next';
        button.id = 'next';
        button.onclick = next;
        active.appendChild(button);
    }
    var last = document.createElement('button');
    last.innerHTML = 'First';
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

function prev() {
    index = index - 5;
    updateContent();
}

function next() {
    index = index + 5;
    updateContent();
}

function gotoFirst() {
    index = 0;
    updateContent();
}

function gotoLast() {
    index = count - count % 5;
    if (index == count) {
        index = index - 5;
    }
    updateContent();
}

xhttp.send(JSON.stringify(args));