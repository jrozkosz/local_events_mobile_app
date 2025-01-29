import os
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash
from datetime import datetime

from .config import Config
from .db import db, User, Event, EventParticipant
from .routes import auth, events
from .routes.auth import jwt

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    # CORS(app, resources={r'/api/*': {'origins': f'{os.environ["FRONTEND_URL"]}'}}, supports_credentials=True)
    # CORS(app, resources={r"/api/*": {"origins": "http://localhost:8081"}}, supports_credentials=True) 
    # CORS(app, supports_credentials=True)
    # CORS(app, origins=[f'{os.environ["FRONTEND_URL"]}'])
    # CORS(app)
    # CORS(app, resources={r'/api/*': {'origins': f'{os.environ["FRONTEND_URL"]}'}})

    if test_config is None:
        app.config.from_object(Config)
    else:
        # load the test config if passed in
        # app.config.from_mapping(test_config)
        pass

    db.init_app(app)
    with app.app_context():
        # db.drop_all()
        db.create_all()

        admin_exists = User.query.filter_by(username="admin").first() is not None
        if not admin_exists:
            password = generate_password_hash("admin", method='pbkdf2:sha256')
            admin = User(username="admin", password=password)
            db.session.add(admin)
            db.session.commit()
            print("\nADMIN CREATED\n")
            password = generate_password_hash("user", method='pbkdf2:sha256')
            user = User(username="user", password=password)
            db.session.add(user)
            db.session.commit()
            print("\nUSER CREATED\n")

            # latitude = 52.2297
            # longitude = 21.0122
            # for i in range(5):
            #     event = Event(
            #         user_id=admin.id,
            #         name="Test event",
            #         description="test desc",
            #         date=datetime(2025, 1, 15, 18, 0),
            #         address="Street name 13/20",
            #         geo_latitude=latitude,
            #         geo_longitude=longitude
            #     )
            #     db.session.add(event)
            #     db.session.commit()
            #     event_participant = EventParticipant(event_id=event.id, user_id=admin.id)
            #     db.session.add(event_participant)
            #     db.session.commit()
            #     event_participant = EventParticipant(event_id=event.id, user_id=user.id)
            #     db.session.add(event_participant)
            #     db.session.commit()

            # print("\nEVENTs CREATED\n")


    jwt.init_app(app)

    app.register_blueprint(auth.bp)
    app.register_blueprint(events.bp)

    from flask import request
    from flask_jwt_extended import decode_token

    @app.before_request
    def check_token():
        auth_header = request.headers.get("Authorization")
        print("\n--- TOKEN RECEIVED ---")
        print(auth_header)
        
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                decoded = decode_token(token)
                print("\n--- DECODED TOKEN ---")
                print(decoded)
            except Exception as e:
                print(f"\n--- TOKEN DECODE ERROR: {e} ---\n")


    # @app.after_request
    # def handle_options(response):
    #     # if request.method == "OPTIONS":
    #     # response = app.make_default_options_response()
    #     # if response:
    #     response.headers["Access-Control-Allow-Origin"] = f"{os.environ["FRONTEND_URL"]}"
    #     response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, PUT, DELETE"
    #     response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    #     if request.method == "OPTIONS":
    #         response.status_code = 200
    #     print(response)
    #     return response

    @app.route('/api')
    def test_page():
        return '<h1>Testing the Flask Application Factory Pattern</h1>'

    return app