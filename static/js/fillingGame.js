import {networkHandler} from "./networkHandler.js";

const fillingGame = {
    /* Get data with fetch API get request via the networkHandler module
   Set up sending data with click eventListener on saving button*/
    init: function () {
        const gameId = document.querySelector(".filling-game").id;
        let solution = [];
        const saveBtn = document.getElementById('save');

        saveBtn.addEventListener('click', () => {
            const answers = document.querySelectorAll('.gap');
            answers.forEach(answer => solution.push(answer.value));
            networkHandler.sendData(solution, `/filling-gap-solution-saver/${gameId}`, networkHandler.redirectHome);
        })

        networkHandler.getData(`/get-game/filling-game/${gameId}`, fillingGame.showData);

    },
    /* Callback function for fetch
    Display game data*/
    showData: function (data) {
        let readingContainer = document.querySelector('.filling-container');
        document.getElementById('theme').textContent = data['theme'];
        const textParts = data['long_text'];
        textParts.forEach(part => part.replaceAll('.', '.\n'));
        let content = '';
        for (let i = 0; i < textParts.length; i++) {
            content += `<p class="long-text">${textParts[i]}</p>`;
            if (i !== textParts.length - 1) content += `<input type="text" class="gap">`;
        }
        readingContainer.innerHTML = content;
    }

}


fillingGame.init();
