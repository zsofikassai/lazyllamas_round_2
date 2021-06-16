import {stopCheck} from "./stopper.js";
import {networkHandler} from "./networkHandler.js";

let gameId = document.querySelector(".memory-game").id;
let theme = document.getElementById('theme');
let numberOfCards = 6;

const memoryGame = {
    /* Callback function for fetch
Display game data*/
    showData: function (cards) {
        theme.innerHTML = cards['theme'];
        let gameUI = document.querySelector('.memory-game');
        let rows = ''
        for (let i = 1; i <= numberOfCards; i++) {
            rows += `   
        <div class="memory-card"  data-framework="${cards[`text${i}`]}">
            <div class="front-face">
                <img src="data:image/png;base64,${cards[`image${i}`]}" />
                <p> ${cards[`text${i}`]}</p>
            </div>
            <img class="back-face" src="/static/images/amigo_logo.png"/>
        </div>
        <div class="memory-card"  data-framework="${cards[`text${i}`]}">
            <div class="front-face">
                <img src="data:image/png;base64,${cards[`image${i}`]}" />
                <p> ${cards[`text${i}`]}</p>
            </div>
            <img class="back-face" src="/static/images/amigo_logo.png"/>
        </div>`
        }
        gameUI.innerHTML = rows
        logic();
    },


}

/**/
function logic() {
    let cards = document.querySelectorAll('.memory-card');
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    cards.forEach(card => card.addEventListener('click', flipCard));

    /* Flips cards to reveal front side
      Checks if card was first or second to be flipped
      Checks for match
      Stops the game if all cards are flipped
    * */
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        this.classList.add('flip');
        if (!hasFlippedCard) {
            //first card clicked
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        //second card clicked
        hasFlippedCard = false;
        secondCard = this;
        checkForMatch();

        if (checkWin()){
             stopCheck.stop(`/memory-solution-saver/${gameId}`);
        }


    }

    function checkWin() {
        let isComplete = true;
        let cards = document.querySelectorAll(".memory-card");
        cards.forEach(item => {
                if (!item.classList.contains("flip")) {
                    isComplete = false;
                }
            }
        )
        return isComplete;
    }


    /* Check if cards are a match*/
    function checkForMatch() {
        let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
        isMatch ? disableMatchedCards() : unflipCards();
    }

    /* Disables flipping on matched cards*/
    function disableMatchedCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    /* Flips cards back if pair was not a match*/
    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1500);

    }

    /*Reset board after round*/
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    /*Shuffle cards after each fetch*/
    (function shuffle() {
        cards.forEach(card => {
            card.style.order = Math.floor(Math.random() * 12);
        });
    })();


}

function init() {
    networkHandler.getData(`/get-game/memory-game/${gameId}`, memoryGame.showData);
}

init();




