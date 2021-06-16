import {networkHandler} from "./networkHandler.js";

/* Timer module for exercises */

let seconds = 0;
let minutes = 0;
let displaySeconds = 0;
let displayMinutes = 0;
let interval = null;
let time = 0;

/* Start the timer on first click*/
window.addEventListener('click', start);


/* Display the timer in minutes and seconds*/
function displayStopper() {
    seconds++;
    if (seconds / 60 === 1) {
        seconds = 0;
        minutes++;
    }
    if (seconds < 10) {
        displaySeconds = "0" + seconds.toString();
    } else {
        displaySeconds = seconds.toString();
    }
    if (minutes < 10) {
        displayMinutes = "0" + minutes.toString();
    } else {
        displaySeconds = minutes.toString();
    }

    document.getElementById("stopper-display").innerHTML = displayMinutes + ":" + displaySeconds;
}

/*Start the timer*/
function start() {
    window.removeEventListener('click', start);
    interval = window.setInterval(displayStopper, 1000);
}

/* Stops timer and sends solution time (seconds) in json to server via fetch api post request*/
export let stopCheck = {
    stop: function (route) {
            window.clearInterval(interval);
            time = document.getElementById("stopper-display").innerHTML
            networkHandler.sendData(countSeconds(time), route, networkHandler.redirectHome);
    }
}

/* Calculates seconds from display string*/
const countSeconds = (str) => {
    const [mm = '0', ss = '0'] = (str || '0:0').split(':');
    const minute = parseInt(mm, 10) || 0;
    const second = parseInt(ss, 10) || 0;
    return (minute * 60) + (second);
};
