const CHECKBOXES = document.querySelectorAll('input[type=checkbox]');


function reverseCheck() {
    let ticked = [];
    CHECKBOXES.forEach(box => ticked.push(box.checked));
    if (!ticked.includes(true)) CHECKBOXES.forEach(box => box.required = true);
    else CHECKBOXES.forEach(box => box.required = false);
    ticked = [];
}

function init() {
    CHECKBOXES.forEach(box => box.addEventListener('change', (reverseCheck)));
}

init();