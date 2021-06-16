import {networkHandler} from "./networkHandler.js";


export let searchStudents = {
    /* Get search parameters from different filter category input fields
    * Set up eventListeners on each category so students are searched on input
    * Get filtered student data with fetch API from server
    * */
    setUp: function () {
        let searchByLanguage = document.getElementById('language');
        let searchByEmail = document.getElementById('email');
        let searchByBirth = document.getElementById('age');
        let searchParams = [searchByBirth, searchByEmail, searchByLanguage]
        searchParams.forEach(item => item.addEventListener('input', function () {
            networkHandler.getData(`/search/${item.id}/${item.value}`, searchStudents.showData)}
        ))
    },
    /* Show filtered students in table*/
    showData: function (studentList) {
        let columnHeaders = ``
        columnHeaders += `
    <tr>
    <th>Tanuló neve</th>
    <th>Email</th>
    <th>Kor</th>
    <th>Tanult nyelv</th>
    <th>Pontok</th>
    </tr>`
        let tableRows = '';
        for (let student of studentList) {
            tableRows += `
      
  <tr class=student id="${student['id']}">
    <td>${student['name']}</td>
    <td>${student['email']}</td>
    <td>${student['age']}</td>
    <td>${student['language']}</td>
    <td>${student['points']}</td>
  </tr>
       `
        }

        let table = columnHeaders + tableRows;
        searchStudents.displayTable(table);

    },
    /* Display the student table on page*/
    displayTable: function (table) {
        let tableContainer = document.getElementById('container');
        tableContainer.innerHTML = table;
        let rows = document.querySelectorAll(".student");
        //If the method was called on the feedback page, display feedback option in each row
        if (tableContainer.classList.contains('feedback') ){
            searchStudents.displayFeedbackBtn(rows);
        }
        //if the method was called on send task page, students can be selected on click
        else{
            searchStudents.selectStudents(rows);
        }
    },
    //select students on click
    selectStudents: function (rows){
        for (let row of rows) {
            row.addEventListener('click', () => {
                row.classList.toggle('selected');
            })
        }
    },
    //Put feedback button in each row
    displayFeedbackBtn: function (rows) {
        for (let row of rows) {
            let feedbackBtn = document.createElement('td');
            feedbackBtn.innerHTML = `<intput type="button" onclick="location.href='/feedback/${row.id}';"> Értékelés </intput>`
            row.appendChild(feedbackBtn);
        }
    }

}

searchStudents.setUp();