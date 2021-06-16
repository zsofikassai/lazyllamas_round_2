const texter = document.getElementById('texter');
const gapper = document.getElementById('gapper');
const inserter = document.getElementById('text-inserter');
const submit = document.getElementById('submit');
let DATA = {};

function resetInserter() {
    inserter.value='';
    inserter.placeholder='Szöveg helye';
}

function insertText() {
    if (!inserter.value) return; //Can't insert empty field
    let content = inserter.value;
    const field = `<input type="text" name="text" value="${content}" class="long-text">`;
    inserter.parentElement.insertAdjacentHTML('beforeend', field);
    resetInserter();
}

function insertGap() { //Can only insert gaps
    const field = `<input type="text" name="text" value="" class="gap" READONLY/>`;

    inserter.parentElement.insertAdjacentHTML('beforeend', field);
}

function collectAndSend() {
    if (!document.getElementById('theme').value) {
        alert('Kérlek add meg a témát!');
        return;
    }
    DATA['theme'] = document.getElementById('theme').value;
    let longText = [];
    const longs = document.querySelectorAll('.long-text');
    for (let i = 0; i < longs.length; i++) {
        longText.push(longs[i].value);
    }
    DATA['long'] = longText;
    DATA['gaps'] = longText.length - 1;
    postData();
}

function postData() {
    fetch('/filling-gaps-upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(DATA)
    }).then(r => {
        if (r.status === 200) window.location = '/';
    });
}

texter.addEventListener('click', insertText);
gapper.addEventListener('click', insertGap);
submit.addEventListener('click', collectAndSend);

