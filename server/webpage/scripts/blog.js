var xhttp = new XMLHttpRequest();
xhttp.open('GET', `/getblogs?page=0`);
var args = {
    'blogIndex': 0,
};
var index = 0;
var count;
var cache = [];
xhttp.addEventListener('loadend', () => {
    document.getElementById('content').innerHTML = ``;
    var data = JSON.parse(xhttp.response);
    console.log(data);
    var active = document.getElementById('content');
    count = data.count;
    if (index - 5 >= 0) {
        var button = document.createElement('button');
        button.innerHTML = 'Previous';
        button.id = 'top';
        button.onclick = prev;
        active.appendChild(button);
    }
    if (index + 5 < data.count) {
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
        index = index;
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
    if (index - 5 >= 0) {
        var button = document.createElement('button');
        button.innerHTML = 'Previous';
        button.id = 'bottom';
        button.onclick = prev;
        active.appendChild(button);
    }
    if (index + 5 < data.count) {
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
        index = index;
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
    cache[index / 5] = active.innerHTML;
    if(cache.length > 5) {
        cache.splice(0, 1);
    }
    console.log(cache);
})

function updateContent() {
    if (!cache[index / 5]) {
        document.getElementById('content').innerHTML = `<p class="title">Loading...</p>`;
        args = {
            'blogIndex': index
        };
        xhttp.open('GET', `/getblogs?page=${index / 5}`);
        xhttp.send(JSON.stringify(args));
    } else {
        console.log(index / 5);
        document.getElementById('content').innerHTML = cache[index / 5];
        var buttons = document.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            var b = buttons[i];
            switch (b.innerHTML) {
                case 'Previous':
                    b.onclick = prev;
                    break;
                case 'Next':
                    b.onclick = next;
                    break;
                case 'Latest':
                    b.onclick = gotoFirst;
                    break;
                case 'First':
                    b.onclick = gotoLast;
                    break;
            }
        }
    }
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

xhttp.send();