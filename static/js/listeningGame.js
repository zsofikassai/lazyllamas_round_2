import {networkHandler} from "./networkHandler.js";


let listeningGame = {
        /* Get data with fetch API get request via the networkHandler module
       Set up sending data with click eventListener on saving button
    * */
    init: function () {
        let gameId = document.querySelector(".listening-game").id;
        let saveBtn = document.getElementById('save');

        let solution = [];
        let selectedAnswers = [];
        saveBtn.addEventListener('click', () => {
            selectedAnswers = document.querySelectorAll('.selected');
            for (let answer of selectedAnswers) {
                solution.push(answer.innerText);
            }

            networkHandler.sendData(solution,`/listening-solution-saver/${gameId}`, networkHandler.redirectHome);
        })
        networkHandler.getData(`/get-listening-game/${gameId}`, listeningGame.getElements);

    },
    /* Complie HTML to display game data*/
    getElements: function (data) {
        let elements = ``
        for (let element of data) {
            elements += `
            <div class="card">
            <div class="play">
                <input type="image" value="${element['correct_answer']}" name="${element['language']}" src="../static/images/play.png"
                    draggable="false"  class="answer" >
                </div>
                <div class="answers" id="${element['correct_answer']}">
                `
            for (let i = 0; i < 3; i++) {
                elements += `
            <button class="possibilities">${element["answers"][i]}</button>
        `
            }
            elements += `

                </div>
            </div>
    `
        }
        listeningGame.showElements(elements);

    },
    /* Display game data on template and shuffle answer cards*/
    showElements: function (elements) {
        let container = document.getElementById("container");
        container.innerHTML = elements;
        this.logic();
        let answerCards = document.querySelectorAll('.possibilities');
        (function shuffle() {
            answerCards.forEach(card => {
                card.style.order = Math.floor(Math.random() * 12);
            });
        })();
    },
    /* Words are selected and unselected by click
    *  ResponsiveVoice API reads the word
    * */
    logic: function () {
        let words = document.querySelectorAll('.possibilities');
        for (let word of words) {
            word.addEventListener("click", e => {
                e.target.classList.toggle('selected');
            })
        }
        let buttons = document.querySelectorAll('.answer')
        for (let button of buttons) {
            button.addEventListener("click", e => {
                let answer = e.target.value
                let language = e.target.name
                responsiveVoice.speak(answer, language);
            });
        }

    }

}

listeningGame.init();
