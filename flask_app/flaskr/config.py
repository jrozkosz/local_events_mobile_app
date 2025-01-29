import os
from dotenv import load_dotenv
import datetime

load_dotenv()

class Config:
    SECRET_KEY = os.environ["SECRET_KEY"]
    SECURITY_PASSWORD_SALT = 'my_precious_two'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = f'mysql+mysqlconnector://{os.environ["MYSQL_USER"]}:{os.environ["MYSQL_PASSWORD"]}@localhost:{os.environ["MYSQL_PORT"]}/{os.environ["MYSQL_DB_NAME"]}'

    JWT_SECRET_KEY = f'{os.environ["JWT_SECRET_KEY"]}'
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=1)

    # CORS_HEADERS = 'Content-Type'