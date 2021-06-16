import os
from pathlib import Path
import bcrypt


def hash_it(psw):
    encrypted_pw = bcrypt.hashpw(psw.encode('utf-8'), bcrypt.gensalt())
    return encrypted_pw


def verify_pw(stored_pw, pw):
    return bcrypt.checkpw(stored_pw.encode('utf-8'), pw.encode('utf-8'))


def get_image(file):
    image_path = f"/static/images"
    image_folder_path = f"{Path(__name__).parent}{image_path}"
    file.save(os.path.join(image_folder_path, file.filename))
    image = "images/" + file.filename
    return image
