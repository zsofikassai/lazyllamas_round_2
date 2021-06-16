/*Display user progress based their points on progress bar
Display the badges the user earned
* */

function initBadges() {
    const progressBar = document.querySelector(".progression");
    let score = Number(document.getElementById("points").textContent);
    let collectedBadges = 0;

    while (score >= 100) {
        score = score - 100;
        collectedBadges++;
    }

    for (let i = 1; i <= collectedBadges; i++) {
        document.getElementById(i.toString()).classList.remove("cover");
    }

    let progression = 100 - score;
    progressBar.style.left = `-${progression}%`
}

initBadges();
