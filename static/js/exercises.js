/* Redirect from category page to the page where all the exercises in the category are displayed*/

let GameBtns = document.querySelectorAll('.exercise');
GameBtns.forEach(item =>{item.addEventListener('click', redirect);})

function redirect() {
  window.location.href = `/${this.id}`;

}