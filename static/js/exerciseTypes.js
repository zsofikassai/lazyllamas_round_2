let exerciseTypes = {
    /*Redirect to the game on which the amigo clicked,
    redirection route in the game's title element class
    Send exercise to students option is displayed
    */
    redirectToExercise() {
        let exerciseTypes = document.querySelectorAll('.exercise-type');
        exerciseTypes.forEach(exerciseType => {
            exerciseType.addEventListener('click', ()=>{
                window.location.href = `/${exerciseType.id}`;
            });
        })

    }

};

exerciseTypes.redirectToExercise();
