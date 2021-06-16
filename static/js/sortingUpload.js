import {networkHandler} from "./networkHandler.js";

/* Uploads new sorting game*/

const wordInput = document.getElementById('word-source');
let saveBtn = document.querySelector('.save');
let addWordBtn = document.getElementById('addWord');
let data = {};

let sortingUpload = {

    init: function () {
        addWordBtn.addEventListener('click', sortingUpload.insertWord);
        saveBtn.addEventListener('click', sortingUpload.getAllData);
    },

    insertWord: function () {
        const target = document.getElementById('word-form');
        wordInput.placeholder = ' Írj ide ';
        if (wordInput.value !== '') {
            let toInsert = `<input class="words to-add" type="text" value="${wordInput.value}">`;
            wordInput.value = '';
            target.insertAdjacentHTML('beforeend', toInsert);
        }
    },
    getAllData: function () {
        let theme = document.getElementById("theme").value;
        let categoryInputs = document.querySelectorAll(".category-input");
        let categories = [];
        let words = [];
        categoryInputs.forEach(categoryInput => {
            categories.push(categoryInput.value);
        })
        document.querySelectorAll('.to-add').forEach(word => words.push(word.value));
        data['language'] = document.getElementById("language").value;
        data['theme'] = theme;
        data['categories'] = categories;
        data['words'] = words;
        networkHandler.sendData(data, '/sorting-game-upload', networkHandler.redirectHome)

    }
}
sortingUpload.init();












