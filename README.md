# **The Amigos project from LazyLlamas**

## **Overview**

This repository contains a language-learning app's prototype made for Amigos a gyerekekért foundation during the
CodeToGive 2021 hackathon organized by Morgan Stanley. Our goal was to create a platform for 6-12 year old children
which is fun, playful but nevertheless can be used to advance one's language skills.

Our primary focus was creating customizable exercise templates for Amigos in order to engage the students in various
types of gamified tasks. Currently, there are six types of game types available:

    -Memory game: timer-based flip-the-cards game with 6 image-word pairs
    -Listening game: with the help of the Responsive Voice API
    -Matching game: timer-based find-the-pair game with 6 image-word pairs
    -Comprehensive reading: Given an article, students has to answer questions
    -Fill in the gaps: students have to fill missing words from a text
    -Sorting by categories: word drag&drop game up to 4 different categories

## **Technologies**

Amigo teachers can create each of these exercises in 16 different languages. We store each of them in a PostgreSQL
database, so they are flexibly reusable. The app runs on Python's Flask framework, we use the Jinja2 templating engine
and JavaScript for game mechanics and data transfer, and created a unique, yet familiar design to Amigos with the help
of CSS.

## **How to Install**

If you're from a UNIX system, simply type

```
bash build.sh
```

in your terminal, because we created a script for installing all the necessary building blocks for the project.

* **Note:** database connection is secured using a .env file and Python's dotenv package. You have to create it in the root folder of the project,
  environmental variables declared in connection.get_connection_data() function.

### Basically, you'll need these things to run the app:

        -Python3
        -PostgreSQL
        -dependencies from the requirements.txt file

## Useful links

* [Download PostgreSQL](https://www.postgresql.org/download/)
* [Download Python3](https://www.python.org/downloads/)
* [Responsive Voice API](https://responsivevoice.org/)

