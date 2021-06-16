import {networkHandler} from "./networkHandler";


/*Set up eventListeners for adding new question and submitting the data*/
function init() {
    let saveBtn = document.getElementById("save");
    saveBtn.addEventListener('click', uploadData);

}

/*Collect data from input fields and send via fetch post request to server*/
function uploadData() {
    let data = {};
    let questionNumber = 6;
    let cardAnswers = [];
    let textUploads = [];
    let language = document.getElementById("language").value;
    let theme = document.getElementById("theme").value;
    let cards = [];
    for (let i = 0; i < questionNumber; i++) {
        textUploads.push(document.querySelectorAll(`[data-name=${CSS.escape(i.toString())}]`));
    }
    for (let card of textUploads) {
        cardAnswers = []
        for (let answer of card) {
            cardAnswers.push(answer.value);
        }
        cards.push(cardAnswers);
    }

    data.cards = cards;
    data.language = language;
    data.theme = theme;

    networkHandler.sendData(data, '/listening-game-upload', networkHandler.redirectHome);

}

init();