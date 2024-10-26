import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ["SECRET_KEY"]
    SECURITY_PASSWORD_SALT = 'my_precious_two'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = f'mysql+mysqlconnector://{os.environ["MYSQL_USER"]}:{os.environ["MYSQL_PASSWORD"]}@localhost:{os.environ["MYSQL_PORT"]}/{os.environ["MYSQL_DB_NAME"]}'

