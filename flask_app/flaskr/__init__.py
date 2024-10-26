import os
from flask import Flask

from .config import Config
from .db import db
from .routes import register

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        app.config.from_object(Config)
    else:
        # load the test config if passed in
        # app.config.from_mapping(test_config)
        pass

    db.init_app(app)
    with app.app_context():
        db.drop_all()
        db.create_all()

    app.register_blueprint(register.bp)
    
    @app.route('/')
    def test_page():
        return '<h1>Testing the Flask Application Factory Pattern</h1>'

    return app