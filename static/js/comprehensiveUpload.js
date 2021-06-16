import {networkHandler} from "./networkHandler.js";

const addQuestionBtn = document.getElementById('button');

let comprehensiveReadingUpload = {

    /*Set up eventListeners for adding new question and submitting the data*/
    init: function () {
        const submit = document.getElementById('submit');
        addQuestionBtn.addEventListener('click', this.addQuestion);
        submit.addEventListener('click', this.collectAndSendData);
    },

    /*Collect data from input fields and send via fetch post request to server*/
    collectAndSendData: function () {
        let data = {};
        data['language'] = document.getElementById("language").value;
        data['theme'] = document.getElementById('theme').value;
        data['long-text'] = document.getElementById('long-text').value;
        let questionInputs = document.querySelectorAll('.questions');
        let questions = [];
        for (let question of questionInputs) {
            if (question.value !== 'Itt tehetsz fel újabb kérdést') questions.push(question.value);
        }
        data['questions'] = questions;
        networkHandler.sendData(data, '/comprehensive-reading-upload', networkHandler.redirectHome);

    },

    /* Add question user input to container and
    add a new question input field for additional question*/
    addQuestion: function () {
        let additionalQuestion = `<input type="text" class="questions" value="${addQuestionBtn.previousElementSibling.value}">`;
        document.querySelector('.question-container').firstElementChild.insertAdjacentHTML('beforeend', additionalQuestion);
        addQuestionBtn.previousElementSibling.value = '';
    }
}

comprehensiveReadingUpload.init();

