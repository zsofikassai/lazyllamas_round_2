#!/bin/bash

sudo apt-get update
sudo apt install python3.8
sudo apt-get -y install python3-pip

sudo apt-get install postgresql postgresql-contrib
createuser --interactive
createdb amigos
sudo apt-get install python3-dev libpq-dev postgresql-client postgresql-client-common
sudo pip install psycopg2

sudo apt install python3-venv
python3 -m venv venv
source venv/bin/activate
pip install Flask

pip install -r requirements.txt
