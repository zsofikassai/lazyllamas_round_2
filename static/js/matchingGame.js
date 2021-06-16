import { stopCheck } from "./stopper.js";
import {networkHandler} from "./networkHandler.js";

let gameId = document.querySelector(".matching-game").id;
let numberOfCards = 6;

const matchingGame = {
        /* Callback function for fetch
    Display game data*/
    showData: function (cards) {
        let wordContainer = document.querySelector('.word-container');
        let imageContainer = document.querySelector('.image-container');

        let imageList = '';
        let wordList = '<ul>';
        for (let i = 1; i <= numberOfCards; i++) {
            wordList += `<li class="words-to-match" id="${cards[`text${i}`]}">${cards[`text${i}`]}</li>`;
            imageList += `
            <div class="flashcard-container">
            <img class="flashcard images-to-match" src="data:image/png;base64,${cards[`image${i}`]}" data-word="${cards[`text${i}`]}">
            </div>
            `
        }
        wordList += '</ul>'
        wordContainer.innerHTML = wordList;
        imageContainer.innerHTML = imageList;
        logic();
    },

}

function logic() {
    let WORDS = document.querySelectorAll('.words-to-match');
    let IMAGES = document.querySelectorAll('.images-to-match');
    let hasChosenWord = false;
    let hasChosenImage = false;
    let CHOSEN_WORD, CHOSEN_IMAGE;

    /* Set up eventListeners so cards and pictures can be selected*/
    function setup() {
        //Blocking right clicks
        WORDS.forEach(word => word.addEventListener('contextmenu', event => event.preventDefault()));
        IMAGES.forEach(image => image.addEventListener('contextmenu', event => event.preventDefault()));
        IMAGES.forEach(image => image.addEventListener('click', chooseImage));
        WORDS.forEach(word => word.addEventListener('click', chooseWord));
    }

    setup();

    /* Highlightes chosen word and check for match if an image was selected before*/
    /* Unselects the text if it was previously selected*/
    function chooseWord() {
        if (this.id === CHOSEN_WORD){
            this.classList.remove('marked-purple');
            CHOSEN_WORD = null;
            hasChosenWord = false;
        }else{
            if (hasChosenWord) return;
            this.classList.add('marked-purple');
            hasChosenWord = true;
            CHOSEN_WORD = this.id;
            if (hasChosenImage) checkMatch();
        }
    }

      /* Highlightes chosen image and check for match if a word was selected before*/
    /* Unselects the text if it was previously selected*/
    function chooseImage() {
        if (this.dataset['word'] === CHOSEN_IMAGE){
            this.parentElement.classList.remove('flashcard-active');
            CHOSEN_IMAGE = null;
            hasChosenImage = false;
        }else{
            if (hasChosenImage) return;
            this.parentElement.classList.add('flashcard-active');
            hasChosenImage = true;
            CHOSEN_IMAGE = this.dataset['word'];
            if (hasChosenWord) checkMatch();
        }

    }

    /* Mark image with a tick if it was paired with the right word*/
    function mark() {
        let img = document.createElement('img');
        img.src = "/static/images/tick.jpg";
        img.classList.add('tick');
        document.querySelector('.flashcard-active').appendChild(img);
    }

    /* Check if image matches word*/
    function checkMatch() {
        let match = CHOSEN_IMAGE === CHOSEN_WORD;
        match ? handleMatch() : reset();
    }

    /* Unselect image and word if they don't match, unlock board so other items can be selected*/
    function reset() {
        document.querySelector('.flashcard-active').firstElementChild.classList.remove('images-to-match');
        document.querySelector('.flashcard-active').classList.remove('flashcard-active');
        document.getElementById(CHOSEN_WORD).classList.remove("words-to-match", "marked-purple");
        [CHOSEN_WORD, CHOSEN_IMAGE] = [null, null];
        [hasChosenWord, hasChosenImage] = [null, null];
    }

    /* Highlight word if it was matched correctly*/
    function scoreWord() {
        document.getElementById(CHOSEN_WORD).classList.add('marked-green');

    }

    /*If a pair was matched correctly, remove them from the list of words and images and reset board
    * Check if this was the last pair
    * */
    function handleMatch() {
        scoreWord();
        mark();
        WORDS = document.querySelectorAll('.words-to-match');
        IMAGES = document.querySelectorAll('.images-to-match');
        reset();
         if (winCheck()) stopCheck.stop(`/matching-solution-saver/${gameId}`);
    }

    /* Check if the are no words left to match*/
    function winCheck() {
        return document.querySelectorAll('.words-to-match').length === 0;
    }

    /* Shuffle words and images*/
    (function shuffle() {
        let randomPos = Math.floor(Math.random() * 6);
        WORDS.forEach(word => {
            word.style.order = randomPos;
        });
        IMAGES.forEach(image => {
            image.style.order = randomPos;
        });
    })();

}

function init() {
    networkHandler.getData(`/get-game/memory-game/${gameId}`, matchingGame.showData);
}

init();
