ALTER TABLE IF EXISTS ONLY public.student
    DROP CONSTRAINT IF EXISTS fk_languages CASCADE,
    DROP CONSTRAINT IF EXISTS fk_language_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.feedback
    DROP CONSTRAINT IF EXISTS fk_amigo_id CASCADE,
    DROP CONSTRAINT IF EXISTS fk_student_id CASCADE;


DROP TABLE IF EXISTS public.amigo;
DROP TABLE IF EXISTS public.student;

DROP TABLE IF EXISTS public.solution;
DROP TABLE IF EXISTS public.feedback;

DROP TABLE IF EXISTS public.student_languages;
DROP TABLE IF EXISTS public.language;

DROP TABLE IF EXISTS public.memory_game;
DROP TABLE IF EXISTS public.sorting_game;
DROP TABLE IF EXISTS public.matching_game;
DROP TABLE IF EXISTS public.comprehensive_reading;
DROP TABLE IF EXISTS public.listening_game;

DROP TABLE IF EXISTS public.memory_game_solution;
DROP TABLE IF EXISTS public.matching_game_solution;
DROP TABLE IF EXISTS public.comprehensive_reading_solution;
DROP TABLE IF EXISTS public.listening_game_solution;

DROP TABLE IF EXISTS public.student_exercises;
DROP TABLE IF EXISTS public.exercise_type;
DROP TABLE IF EXISTS public.filling_game;
DROP TABLE IF EXISTS public.filling_game_solution;
DROP TABLE IF EXISTS public.sorting_game_solution;


CREATE OR REPLACE FUNCTION
student_age( birthday date )
RETURNS int
AS $CODE$
BEGIN
    RETURN extract( year FROM CURRENT_DATE )
           - extract( year FROM birthday )
           + 1;
END
$CODE$
LANGUAGE plpgsql IMMUTABLE;


CREATE TABLE amigo
(
    id       INT GENERATED ALWAYS AS IDENTITY,
    "name"   VARCHAR(50) NOT NULL,
    email    VARCHAR(50) NOT NULL UNIQUE,
    password TEXT        NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE student
(
    id       INT GENERATED ALWAYS AS IDENTITY,
    "name"   VARCHAR(50) NOT NULL,
    email    VARCHAR(50) NOT NULL UNIQUE,
    password TEXT        NOT NULL,
    birthday DATE,
    points   INT,
    age      TEXT GENERATED ALWAYS AS ( student_age( birthday )) STORED,
    PRIMARY KEY (id)
);

CREATE TABLE student_exercises
(
    id         INT GENERATED ALWAYS AS IDENTITY,
    student_id INT,
    game_id    INT,
    game_type  TEXT
);



CREATE TABLE feedback
(
    id                          INT GENERATED ALWAYS AS IDENTITY,
    amigo_id                    INT,
    student_id                  INT,
    title                       text,
    feedback                    text

);


CREATE TABLE language
(
    id         INT GENERATED ALWAYS AS IDENTITY,
    language       TEXT,
    voice_code TEXT,
    PRIMARY KEY (id)
);


CREATE TABLE student_languages
(
    id          INT GENERATED ALWAYS AS IDENTITY,
    student_id  INT,
    language_id INT,
    PRIMARY KEY (id)
);


CREATE TABLE memory_game
(

    id            INT GENERATED ALWAYS AS IDENTITY,
    exercise_type INT DEFAULT 1,
    language      TEXT NOT NULL,
    theme         TEXT NOT NULL,
    image1        VARCHAR,
    text1         TEXT,
    image2        VARCHAR,
    text2         TEXT,
    image3        VARCHAR,
    text3         TEXT,
    image4        VARCHAR,
    text4         TEXT,
    image5        VARCHAR,
    text5         TEXT,
    image6        VARCHAR,
    text6         TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE sorting_game
(
    id            INT GENERATED ALWAYS AS IDENTITY,
    exercise_type INT DEFAULT 2,
    language      TEXT,
    theme         TEXT,
    categories    TEXT[],
    words         TEXT[],
    PRIMARY KEY (id)
);



CREATE TABLE matching_game
(
    id            INT GENERATED ALWAYS AS IDENTITY,
    exercise_type INT DEFAULT 3,
    language      TEXT not null,
    theme         TEXT NOT NULL,
    image1        VARCHAR,
    text1         TEXT,
    image2        VARCHAR,
    text2         TEXT,
    image3        VARCHAR,
    text3         TEXT,
    image4        VARCHAR,
    text4         TEXT,
    image5        VARCHAR,
    text5         TEXT,
    image6        VARCHAR,
    text6         TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE comprehensive_reading
(
    id            INT GENERATED ALWAYS AS IDENTITY,
    exercise_type INT DEFAULT 4,
    language      TEXT,
    theme         TEXT,
    long_text     varchar(1000),
    questions     TEXT[]
);

CREATE TABLE listening_game
(
    id             INT GENERATED ALWAYS AS IDENTITY,
    exercise_type  INT DEFAULT 5,
    game_id        INT,
    language       TEXT,
    theme          TEXT,
    answers        TEXT[],
    correct_answer TEXT,
    PRIMARY KEY (id)
);



CREATE TABLE memory_game_solution
(
    id            INT GENERATED ALWAYS AS IDENTITY,
    student_id    INT,
    game_id       INT,
    solution_time INT
);

CREATE TABLE matching_game_solution
(
    id            INT GENERATED ALWAYS AS IDENTITY,
    student_id    INT,
    game_id       INT,
    solution_time INT
);

CREATE TABLE comprehensive_reading_solution
(
    id         INT GENERATED ALWAYS AS IDENTITY,
    student_id INT,
    game_id    INT,
    solution   TEXT[]
);


CREATE TABLE listening_game_solution
(
    id         INT GENERATED ALWAYS AS IDENTITY,
    student_id INT,
    game_id    INT,
    solution   TEXT[]
);

CREATE TABLE filling_game
(
    id INT GENERATED ALWAYS AS IDENTITY,
    theme TEXT,
    long_text TEXT[],
    gaps INT
);

CREATE TABLE filling_game_solution
(
    id         INT GENERATED ALWAYS AS IDENTITY,
    student_id INT,
    game_id    INT,
    solution   TEXT[]
);

CREATE TABLE sorting_game_solution
(
    id         INT GENERATED ALWAYS AS IDENTITY,
    student_id INT,
    game_id    INT,
    solution   TEXT
);
