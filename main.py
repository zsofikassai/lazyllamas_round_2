import json

from flask import Flask, render_template, url_for, redirect, session, request, flash, jsonify, make_response

import data_handler
import util

app = Flask("amigo")
app.secret_key = b'_5#z2L"F7Q8q\n\xec]/'


# Authenticating user based on an SQL database query by comparing POST request form data.
# Form requires email address and password inputs. Upon successful authentication user role is set
# as student or amigo.
@app.route('/login', methods=['GET', 'POST'])
def login():
    amigos = data_handler.get_amigos()
    students = data_handler.get_students()

    if request.method == 'POST':
        session['email'] = request.form['email']
        for user in amigos:
            if session['email'] == user['email']:
                session['amigo'] = True
                session['id'] = user['id']
                if util.verify_pw(request.form['password'], user['password']):
                    return redirect(url_for('home'))

        # Check if user is a student

        for user in students:
            if session['email'] == user['email']:
                session['amigo'] = False
                session['id'] = user['id']
                # Verify password
                if util.verify_pw(request.form['password'], user['password']):
                    return redirect(url_for('home'))
        else:
            return 'A felhasználó nem található, próbáld újra. Ha nincs még profilod, regisztrálj!'
    else:
        return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/')
def home():
    if not session:
        return redirect(url_for('login'))
    else:
        return render_template('index.html', id=session['id'])


# Get user data from database and display it on the appropriate user profile template.
# Updates user information in database on user post request
# Amigos get access to add new users interface (not yet implemented).
@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if session['amigo']:
        amigo = data_handler.get_amigo(session['id'])
        if request.method == 'POST':
            data_handler.update_amigo(request.form['name'], request.form['birthday'], request.form['email'],
                                      session['id'])
        else:
            return render_template('amigo-profile.html', amigo=amigo)
    else:
        student = data_handler.get_student(session['id'])
        languages = data_handler.get_student_languages(session['id'])
        if request.method == 'POST':
            data_handler.update_student(request.form['name'], request.form['email'], request.form['birthday'],
                                        session['id'])
            student = data_handler.get_student(session['id'])
            return render_template('student-profile.html', student=student, languages=languages)
        else:
            return render_template('student-profile.html', student=student, languages=languages)


# Display selectable game categories when adding a new game
# Only accessible by amigos
@app.route('/new_exercise')
def new_exercise():
    if session['amigo']:
        return render_template("new_exercises.html")
    else:
        return render_template('index.html', id=session['id'])




# Display selectable game categories when browsing all existing games
@app.route('/my_exercises')
def my_exercises():
    return render_template('exercises.html')


# Display selectable game categories when student is browsing games sent to them
@app.route('/my-exercises/<student_id>')
def my_exercises_student(student_id):
    return render_template('student-exercises.html', student_id=student_id)


# Save game solution into appropriate table, based on game type and game id acquired from
# URL query string parameters
@app.route('/send/<game_type>/<game_id>', methods=['GET', 'POST'])
def send_game_to_student(game_type, game_id):
    if request.method == 'POST':
        student_list = request.get_json()
        for student in student_list:
            data_handler.add_student_exercises(student, game_id, game_type)
        return jsonify('Success', 200)
    else:
        return render_template('send-task.html', game_type=game_type, game_id=game_id)


# Save new picture based games into database (memory-game, matching-game)
# determining the game-type based on the URL query string parameter
@app.route('/save/pictures/<game_type>', methods=['GET', 'POST'])
def save_picture_game(game_type):
    if request.method == 'POST':
        data = request.get_json()
        data_handler.save_picture_game(game_type.replace('-', '_'), data["language"], data["theme"], data["images"])
        return jsonify('Success', 200)
    else:
        return render_template('picture-upload.html', game_type=game_type)


# Browse student solutions - not yet implemented
# only accessible by amigos
@app.route('/solutions')
def solutions():
    if session['amigo']:
        return render_template('solutions.html')
    else:
        return render_template('index.html', id=session['id'])


# Save feedback data acquired from post request into database and render feedback interface
@app.route('/feedback/<student_id>', methods=['GET', 'POST'])
def feedbacks(student_id):
    if request.method == 'POST':
        amigo_id = session['id']
        title = request.form['title']
        feedback = request.form['feedback']
        data_handler.give_feedback(amigo_id, student_id, title, feedback)
        return redirect(url_for('students'))
    else:
        return render_template('feedback.html', student_id=student_id)


# Display search interface for students
@app.route('/students')
def students():

    return render_template("list_students.html")


# Filter students by different parameters
# Search parameters acquired from url query string parameters
@app.route('/search/<search_column>/<search_param>')
def search_students(search_param, search_column):
    if search_column == 'age':
        data = data_handler.search_students_by_age(search_param)
    else:
        data = data_handler.search_students(search_param, search_column)
    return jsonify(data)


# List all existing games in a category
# Category is acquired from query string parameter in the format "memory-game"
# When querying the database the parameter is formatted like "memory_game" to match table name format
# Determines from session whether amigo access, if yes, option for sending games to students
# If student access, render template all parameter indicates student is browsing all games,
# not just the ones sent to them (browse all games option disabled)
@app.route('/game-list/<game_type>')
def list_games(game_type):
    games = data_handler.get_games(game_type.replace('-', '_'))
    if session['amigo']:
        return render_template('amigo-game-types.html', games=games, exercise=game_type)
    else:
        return render_template('game-types.html', all=True, games=games, exercise=game_type)


# List all the games in a category that was sent to student
# Query database for games in the category (acquired from query string parameter game_type)
# that are linked to the student (identified by query string student_id)
# Render template where games are visible
# If there are no games linked to student, games parameter is null and template reads "no such games sent"
# In both cases the student is given the option to browse all games in the category
@app.route('/game-list/<game_type>/<student_id>')
def list_student_games(game_type, student_id):
    exercise = game_type.replace('-', '_')
    game_ids = data_handler.get_student_exercises(student_id, game_type)
    if len(game_ids) != 0:
        games = []
        for g_id in game_ids:
            games.append(data_handler.get_game_by_id(exercise, g_id['game_id']))
        return render_template('game-types.html', games=games, exercise=game_type)
    else:
        return render_template('game-types.html', exercise=game_type)


# Get game from database based on query string parameters that determine the
# game's category
@app.route('/get-game/<game_type>/<game_id>')
def get_game(game_type, game_id):
    data = data_handler.get_game_by_id(game_type.replace('-', '_'), game_id)
    return jsonify(data)


# Render game-template
@app.route('/play-game/<game_type>/<game_id>')
def get_game_with_id(game_type, game_id):
    return render_template(f"{game_type}.html", game_id=game_id)


# SORTING GAME


# Save new game into the database
# Game data acquired from json data via POST request
# Render upload interface
# Only accessible for amigos, access determined from session data
@app.route('/sorting-game-upload', methods=['GET', 'POST'])
def sorting_game_upload():
    if session['amigo']:
        if request.method == 'POST':
            data = request.get_json()
            language = data['language']
            theme = data['theme']
            categories = data['categories']
            words = data['words']
            data_handler.save_sorting_exercise(language, theme, categories, words)
            return jsonify('Success', 200)
        else:
            return render_template('sorting_game_upload.html')
    else:
        return render_template('index.html', id=session['id'])


# Save game solution into database acquired from json data via POST request
# if user is not an amigo, their points are increased
@app.route('/sorting-solution-saver/<game_id>', methods=['POST'])
def save_sorting_solution(game_id):
    data = request.get_json()
    data = json.dumps(data)  # Converts JSON object to string, which can be inserted into DB
    data_handler.save_sorting_game_solution(session['id'], game_id, data)
    if not session['amigo']:
        data_handler.update_score(session['id'])
    return jsonify('Success', 200)


# MATCHING GAME

# Save game solution into database acquired from json data via POST request
# if user is not an amigo, their points are increased
@app.route('/matching-solution-saver/<game_id>', methods=['POST'])
def save_matching_solution(game_id):
    solution_time = request.get_json()
    data_handler.save_matching_game_solution(session['id'], game_id, solution_time)
    if not session['amigo']:
        data_handler.update_score(session['id'])
    return jsonify('Success', 200)


# MEMORY GAME

# Save game solution into database acquired from json data via POST request
# if user is not an amigo, their points are increased
@app.route('/memory-solution-saver/<game_id>', methods=['POST'])
def save_memory_solution(game_id):
    solution_time = request.get_json()
    data_handler.save_memory_game_solution(session['id'], game_id, solution_time)
    if not session['amigo']:
        data_handler.update_score(session['id'])
    return jsonify('Success', 200)


# Listening game
# Listening game logic is handled separately, because database structure is different
# Could be refactored if database was restructured and cards were stored in a different table

# List all existing listening games
# Determines from session whether amigo access, if yes, option for sending games to students
# If student access, render template all parameter indicates student is browsing all games,
# not just the ones sent to them (browse all games option disabled)
@app.route('/listening-games')
def list_listening_games():
    exercise = "listening-game"
    games = data_handler.get_listening_games()
    if session['amigo']:
        return render_template('amigo-game-types.html', games=games, exercise=exercise)
    else:
        return render_template('game-types.html', all=True, games=games, exercise=exercise)


# Get game from database based on query string parameters that determine the id
@app.route('/get-listening-game/<game_id>')
def get_listening_game(game_id):
    data = data_handler.get_listening_game(game_id)
    return jsonify(data)

# Display listening game
@app.route('/listening-game/<game_id>')
def listening_game_with_id(game_id):
    return render_template('listening-game.html', game_id=game_id)


# Upload new listening game
# Game data acquired from json data via POST request
# Render upload interface
# Only accessible for amigos, access determined from session data
@app.route('/listening-game-upload', methods=['GET', 'POST'])
def listening_game_upload():
    if session['amigo']:
        if request.method == 'POST':
            data = request.get_json()
            game_id_data = data_handler.get_latest_listening_game_id()
            if game_id_data is None:
                game_id = 1
            else:
                game_id = game_id_data["game_id"] + 1
            for card in data["cards"]:
                data_handler.save_listening_game(game_id, data["language"], data["theme"], card)
            return jsonify('Success', 200)
        else:
            languages = data_handler.get_languages()
            return render_template('listening_game_upload.html', languages=languages)
    else:
        return render_template('index.html', id=session['id'])


# Save game solution into database acquired from json data via POST request
# if user is not an amigo, their points are increased
@app.route('/listening-solution-saver/<game_id>', methods=['POST'])
def save_listening_solution(game_id):
    solution = request.get_json()
    data_handler.save_listening_game_solution(session['id'], game_id, solution)
    if not session['amigo']:
        data_handler.update_score(session['id'])
    return jsonify('Success', 200)


# List all the listening games
# that are linked to the student (identified by query string student_id)
# Render template where games are visible
# If there are no games linked to student, games parameter is null and template reads "no such games sent"
# In both cases the student is given the option to browse all games in the category
@app.route('/listening-games/<student_id>')
def list_student_listening_games(student_id):
    exercise = "listening-game"
    game_ids = data_handler.get_student_exercises(student_id, exercise)
    if len(game_ids) != 0:
        listening_games = []
        for g_id in game_ids:
            listening_games.append(data_handler.get_listening_game(g_id['game_id']))
            print(listening_games[0])
        return render_template('game-types.html', games=listening_games, exercise=exercise)
    else:
        return render_template('game-types.html', exercise=exercise)


# COMPREHENSIVE READING

# Upload new listening game
# Game data acquired from json data via POST request
# Render upload interface
# Only accessible for amigos, access determined from session data
@app.route('/comprehensive-reading-upload', methods=['GET', 'POST'])
def comprehensive_reading_upload():
    if session['amigo']:
        if request.method == 'POST':
            theme_text_and_questions = request.get_json()
            language = theme_text_and_questions['language']
            theme = theme_text_and_questions['theme']
            long_text = theme_text_and_questions['long-text']
            questions = theme_text_and_questions['questions']
            data_handler.save_reading_exercise(language, theme, long_text, questions)
            return jsonify('Success', 200)
        else:
            return render_template('comprehensive_reading_upload.html')
    else:
        return render_template('index.html', id=session['id'])


# Save game solution into database acquired from json data via POST request
# if user is not an amigo, their points are increased
@app.route('/comprehensive-reading-solution-saver/<game_id>', methods=['POST'])
def save_comprehensive_reading_solution(game_id):
    solution = request.get_json()
    data_handler.save_comprehensive_reading_solution(session['id'], game_id, solution)
    if not session['amigo']:
        data_handler.update_score(session['id'])
    return jsonify('Success', 200)


# FILLING GAPS

# Upload new listening game
# Game data acquired from json data via POST request
# Render upload interface
# Only accessible for amigos, access determined from session data
@app.route('/filling-gaps-upload', methods=['GET', 'POST'])
def filling_gaps_upload():
    if session['amigo']:
        if request.method == 'POST':
            data = request.get_json()
            theme = data['theme']
            long_text = data['long']
            gaps = data['gaps']
            data_handler.save_filling_exercise(theme, long_text, gaps)
            return jsonify('Success', 200)
        else:
            return render_template('filling_upload.html')
    else:
        return render_template('index.html', id=session['id'])


# Save game solution into database acquired from json data via POST request
# if user is not an amigo, their points are increased
@app.route('/filling-gap-solution-saver/<game_id>', methods=['POST'])
def save_filling_game_solution(game_id):
    solution = request.get_json()
    data_handler.save_filling_game_solution(session['id'], game_id, solution)
    if not session['amigo']:
        data_handler.update_score(session['id'])
    return jsonify('Success', 200)


if __name__ == "__main__":
    app.run(
        debug=True,
        port=8000)
