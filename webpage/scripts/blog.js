var xhttp = new XMLHttpRequest();
xhttp.open('POST', '/getblogs');
xhttp.setRequestHeader('Content-Type', 'application/json');
var args = {
    'blogIndex': 0,
};
var index = 0;
var count;
xhttp.addEventListener('loadend', () => {
    document.getElementById('content').innerHTML = ``;
    var data = JSON.parse(xhttp.response);
    var active = document.getElementById('content');
    count = data.count;
    if (args.blogIndex - 5 >= 0) {
        var button = document.createElement('button');
        button.innerHTML = 'Previous';
        button.id = 'top';
        button.onclick = prev;
        active.appendChild(button);
    }
    if (args.blogIndex + 5 < data.count) {
        var button = document.createElement('button');
        button.innerHTML = 'Next';
        button.id = 'top';
        button.onclick = next;
        active.appendChild(button);
    }
    if (index != 0) {
        var first = document.createElement('button');
        first.innerHTML = 'Latest';
        first.id = 'top';
        first.onclick = gotoFirst;
        active.appendChild(first);
        index = args.blogIndex;
    }
    if (index != count - count % 5 && count - count % 5 != count) {
        var last = document.createElement('button');
        last.innerHTML = 'First';
        last.id = 'top';
        last.onclick = gotoLast;
        active.appendChild(last);
    }
    var print = document.createElement('p');
    print.innerHTML = index / 5 + 1;
    print.id = 'index';
    active.appendChild(print);
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
    if (args.blogIndex - 5 >= 0) {
        var button = document.createElement('button');
        button.innerHTML = 'Previous';
        button.id = 'bottom';
        button.onclick = prev;
        active.appendChild(button);
    }
    if (args.blogIndex + 5 < data.count) {
        var button = document.createElement('button');
        button.innerHTML = 'Next';
        button.id = 'bottom';
        button.onclick = next;
        active.appendChild(button);
    }
    if (index != 0) {
        var first = document.createElement('button');
        first.innerHTML = 'Latest';
        first.id = 'bottom';
        first.onclick = gotoFirst;
        active.appendChild(first);
        index = args.blogIndex;
    }
    if (index != count - count % 5 && count - count % 5 != count) {
        var last = document.createElement('button');
        last.innerHTML = 'First';
        last.id = 'bottom';
        last.onclick = gotoLast;
        active.appendChild(last);
    }
    var print = document.createElement('p');
    print.innerHTML = index / 5 + 1;
    print.id = 'index';
    active.appendChild(print);
})

function updateContent() {
    document.getElementById('content').innerHTML = `<p class="title">Loading...</p>`;
    args = {
        'blogIndex': index
    };
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