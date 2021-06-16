from psycopg2._psycopg import AsIs

import connection
def get_amigos():
    return connection.execute_select('SELECT id, email, password FROM amigo;')


def get_students():
    return connection.execute_select('SELECT id, email, password FROM student;')


def add_student_languages(student_id, languages):
    query = """INSERT INTO student_languages(student_id, language_id) VALUES(%s, %s)"""
    return connection.execute_dml_statement(query, {"student_id": student_id, "languages": languages})


def update_student_languages(student_id, languages):
    query = """UPDATE student_languages 
                SET language_id=(%s) 
                WHERE student_id=(%s)"""
    return connection.execute_dml_statement(query, {"languages": languages, "student_id": student_id})


def get_languages():
    query = """
    SELECT language, voice_code FROM language
    """
    return connection.execute_select(query)


def get_amigo(amigo_id):
    query = """ SELECT * FROM amigo
                WHERE id = %(amigo_id)s;
    """
    return connection.execute_select(query, {"amigo_id": amigo_id}, fetchall=False)


def get_student(student_id):
    query = """ SELECT * FROM student
                WHERE id = %(student_id)s;"""
    return connection.execute_select(query, {"student_id": student_id}, fetchall=False)


def update_amigo(name, email, birthday, id):
    query = """ UPDATE amigo
            SET name = %(name)s, email = %(email)s
            WHERE id = %(id)s;
    """
    return connection.execute_dml_statement(query, {"name": name, "email": email, "birthday": birthday, "id": id})


def update_student(name, email, birthday, id):
    query = """ UPDATE student
            SET name = %(name)s, email = %(email)s, birthday = %(birthday)s
            WHERE id = %(id)s;
    """
    return connection.execute_dml_statement(query, {"name": name, "email": email, "birthday": birthday, "id": id})


def get_student_languages(student_id):
    query = """ SELECT string_agg(DISTINCT language, ', ') as languages FROM student
                INNER JOIN student_languages sl on student.id = sl.student_id
                INNER JOIN language l on sl.language_id=l.id;
    """
    return connection.execute_select(query, {"student_id": student_id}, fetchall=False)


def update_score(student_id):
    query = """UPDATE student
                    SET points = points + 10
                    WHERE id=%(student_id)s"""
    return connection.execute_dml_statement(query, {"student_id": student_id})


def get_student_exercises(student_id, game_type):
    query = """
    SELECT game_id FROM student_exercises
    WHERE student_id = %(student_id)s AND game_type = %(game_type)s;
    """
    return connection.execute_select(query, {"student_id": student_id, "game_type": game_type})


def add_student_exercises(student_id, game_id, game_type):
    query = """
        INSERT INTO student_exercises (student_id, game_id, game_type) VALUES (%(student_id)s, %(game_id)s, %(game_type)s);
    """
    return connection.execute_dml_statement(query,
                                            {"student_id": student_id, "game_id": game_id, "game_type": game_type})


# LISTENING GAME

def get_listening_games():
    query = """
        SELECT DISTINCT game_id as id, theme FROM listening_game;"""
    return connection.execute_select(query)


def get_latest_listening_game_id():
    return connection.execute_select('SELECT game_id FROM listening_game ORDER BY game_id DESC LIMIT 1', fetchall=False)


def save_listening_game(game_id, language, theme, answers):
    query = """
    INSERT INTO listening_game(game_id, language, theme, answers, correct_answer) VALUES (%(game_id)s,  %(language)s,  
    %(theme)s,
    %(answers)s, %(correct)s);
    """
    return connection.execute_dml_statement(query, {"game_id": game_id, "language": language, "theme": theme,
                                                    "answers": answers,
                                                    "correct": answers[0]})


def get_listening_game(game_id):
    query = """
    SELECT * FROM listening_game
    WHERE game_id = %(game_id)s
     """
    return connection.execute_select(query, {"game_id": game_id})


def save_listening_game_solution(student_id, game_id, solution):
    query = """
       INSERT INTO listening_game_solution(student_id, game_id, solution) VALUES (%(student_id)s, %(game_id)s,   %(solution)s);
       """
    return connection.execute_dml_statement(query, {"game_id": game_id, "solution": solution, "student_id": student_id})


# SORTING GAME

def save_sorting_exercise(language, theme, categories, words):
    query = 'INSERT INTO sorting_game(language, theme, categories, words) VALUES (%(language)s, %(theme)s, %(categories)s, %(words)s)'
    return connection.execute_dml_statement(query, {"language": language, "theme": theme, "words": words,
                                                    "categories": categories})


def save_sorting_game_solution(student_id, game_id, solution):
    query = """
     INSERT INTO sorting_game_solution(student_id, game_id, solution) 
                VALUES(%(student_id)s, %(game_id)s, %(solution)s)
     """
    return connection.execute_dml_statement(query, {"student_id": student_id, "game_id": game_id,
                                                    "solution": solution})


# MATCHING GAME

def save_matching_game_solution(student_id, game_id, solution_time):
    query = """
     INSERT INTO matching_game_solution(student_id, game_id, solution_time) 
                VALUES(%(student_id)s, %(game_id)s, %(solution_time)s)
     """
    return connection.execute_dml_statement(query, {"student_id": student_id, "game_id": game_id,
                                                    "solution_time": solution_time})


# COMPREHENSIVE READING

def save_reading_exercise(language, theme, long_text, questions):
    query = """INSERT INTO comprehensive_reading(language, theme, long_text, questions) VALUES (%(language)s, %(theme)s, %(long_text)s, %(questions)s);"""
    return connection.execute_dml_statement(query, {"language": language, "theme": theme, "long_text": long_text,
                                                    "questions": questions})


def save_comprehensive_reading_solution(student_id, game_id, solution):
    query = """
       INSERT INTO comprehensive_reading_solution(student_id, game_id, solution) VALUES (%(student_id)s, %(game_id)s,   %(solution)s);
       """
    return connection.execute_dml_statement(query, {"game_id": game_id, "solution": solution, "student_id": student_id})


# FILLING GAPS

def save_filling_exercise(theme, long_text, gaps):
    query = """INSERT INTO filling_gaps(theme, long_text, gaps) VALUES (%(theme)s, %(long_text)s, %(gaps)s)
    ;"""
    return connection.execute_dml_statement(query, {"theme": theme, "long_text": long_text, "gaps": gaps})


def save_filling_game_solution(student_id, game_id, solution):
    query = """
           INSERT INTO filling_game_solution(student_id, game_id, solution) VALUES (%(student_id)s, %(game_id)s,   %(solution)s);
           """
    return connection.execute_dml_statement(query, {"game_id": game_id, "solution": solution, "student_id": student_id})


def search_students(search_param, searched_column):
    query = """
    SELECT student.id, student.name AS name , email , age,  array_agg(language) as language, points  FROM student
    LEFT JOIN student_languages sl on student.id = sl.student_id
    LEFT JOIN language l on sl.language_id = l.id
    WHERE %(searched_column)s ILIKE %(search_param)s 
    GROUP BY student.id, student.name, email, age, points
    """
    return connection.execute_select(query, {'search_param': '%' + search_param + '%', "searched_column": AsIs(searched_column)})


def search_students_by_age(age):
    query = """
    SELECT student.id, student.name AS name , email , age,  array_agg(language) as language, points  FROM student
    LEFT JOIN student_languages sl on student.id = sl.student_id
    LEFT JOIN language l on sl.language_id = l.id
    WHERE age = %(age)s 
    GROUP BY student.id, student.name, email, DATE_PART('year', birthday), points
    """
    return connection.execute_select(query, {'age': age})



def give_feedback(amigo_id, student_id, title, feedback):
    query = """
    INSERT INTO feedback(amigo_id, student_id, title, feedback) 
    VALUES (%(amigo_id)s, %(student_id)s, %(title)s, %(feedback)s);
    """
    return connection.execute_dml_statement(query, {"amigo_id": amigo_id, "student_id": student_id, "title": title,
                                                    "feedback": feedback})

def get_game_by_id(game_type, game_id):
    query = """
                SELECT * FROM %(game_type)s
                WHERE id = %(game_id)s;
            """
    return connection.execute_select(query, {"game_type": AsIs(game_type), "game_id": game_id}, fetchall=False)


def get_games(game_type):
    query = """
             SELECT id, theme FROM %(game_type)s;
         """
    return connection.execute_select(query, {"game_type": AsIs(game_type)})


def save_picture_game(game_type, language, theme, images):
    query = """
        INSERT INTO %(game_type)s (language, theme, image1, text1, image2, text2, image3, text3, image4, text4, image5, text5, image6, text6)
                   VALUES(%(language)s, %(theme)s, %(image1)s, %(text1)s, %(image2)s, %(text2)s, %(image3)s, %(text3)s, %(image4)s, %(text4)s, %(image5)s, %(text5)s, %(image6)s, %(text6)s)
        """
    return connection.execute_dml_statement(query,
                                            {"game_type": AsIs(game_type), "language": language, "theme": theme, "image1": images[0]["image"],
                                             "text1": images[0]["text"], "image2": images[1]["image"],
                                             "text2": images[1]["text"],
                                             "image3": images[2]["image"], "text3": images[2]["text"],
                                             "image4": images[3]["image"],
                                             "text4": images[3]["text"], "image5": images[4]["image"],
                                             "text5": images[4]["text"],
                                             "image6": images[5]["image"], "text6": images[5]["text"]})

def save_memory_game_solution(student_id, game_id, solution_time):
    query = """
    INSERT INTO memory_game_solution(student_id, game_id, solution_time) 
               VALUES(%(student_id)s, %(game_id)s, %(solution_time)s)
    """
    return connection.execute_dml_statement(query, {"student_id": student_id, "game_id": game_id,
                                                    "solution_time": solution_time})