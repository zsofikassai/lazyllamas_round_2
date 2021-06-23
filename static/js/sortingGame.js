import {networkHandler} from "./networkHandler.js";

let gameId = document.querySelector(".sorting-game").id;

const sortingGame = {
    //Display game data on page and call game logic driver function
    showData: function (data) {
        const wordContainer = document.querySelector('.word-container');
        const theme = `<h2>${data.theme}</h2>`;
        wordContainer.insertAdjacentHTML('afterbegin', theme);
        for (let i = 0; i < data.words.length; i++) {
            let pTag = `<p class="words draggable" draggable="true">${data.words[i]}</p>`
            wordContainer.insertAdjacentHTML('beforeend', pTag);
        }
        for (let i = 0; i < data.categories.length; i++) {
            const categoryContainer = document.querySelector('.category-container');
            let categoryDiv = `<div class="category-card droppable">${data.categories[i]}</div>`;
            categoryContainer.insertAdjacentHTML('afterbegin', categoryDiv);
        }
        logic();
    }
}

//Set up drag and drop logic
function logic() {
    const DRAGGABLES = document.querySelectorAll('.draggable');
    const DROPPABLES = document.querySelectorAll('.droppable');
    const SUBMIT = document.querySelector('.submit');

    DRAGGABLES.forEach(ele => { //Toggling class for better visualisation
        ele.addEventListener('dragstart', () => {
            ele.classList.add('dragging');
        })

        ele.addEventListener('dragend', () => {
            ele.classList.remove('dragging');
        })
    })

    DROPPABLES.forEach(droppable => { //
        droppable.addEventListener('dragover', (e) => {
            e.preventDefault();
            const dragged = document.querySelector('.dragging');
            droppable.appendChild(dragged);
        });
    })

    /* Collect solution data and save it to database with fetch API post*/
    function collectSolution() {
        let SOLUTION = {};
        const categories = document.querySelectorAll('.category-card');
        categories.forEach(category => { //Initializing object's keys as given themes
            SOLUTION[category.innerText.split("\n")[0]] = [];
            for (let i = 0; i < category.childElementCount; i++) {
                SOLUTION[category.innerText.split("\n")[0]].push(category.children[i].innerText);
            }
        })
        networkHandler.sendData(SOLUTION, `/sorting-solution-saver/${gameId}`, networkHandler.redirectHome);
    }

    SUBMIT.addEventListener('click', collectSolution);
}


function init() {
    networkHandler.getData(`/get-game/sorting-game/${gameId}`, sortingGame.showData);
}

init();