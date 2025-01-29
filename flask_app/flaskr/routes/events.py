from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin
from datetime import datetime
import os


from flaskr.db import db, User, Event, EventParticipant

bp = Blueprint('events', __name__, url_prefix='/api/events')

jwt = JWTManager()

@bp.route('/my_events', methods=['GET'])
@jwt_required()
def get_events_created_by_user():
    try:
        current_user = get_jwt_identity()
        print(current_user)
        user = User.query.filter_by(username=current_user).first()
        # events = Event.query.filter_by(user_id=user.id).all()
        # print(events)
        events = [{"id": event.id, "created_by": event.created_by.username, "name": event.name, "description": event.description, 
                   "date": event.date, "active": True if event.date > datetime.now() else False,
                    "address": event.address, "longitude": event.geo_longitude, "latitude": event.geo_latitude, 
                   "participants": [User.query.filter_by(id=participant.user_id).first().username
                                     for participant in event.participants]} for event in user.events_created]
        
        active_events = sorted(
            [event for event in events if event["active"]],
            key=lambda x: x["date"]
        )
        inactive_events = sorted(
            [event for event in events if not event["active"]],
            key=lambda x: x["date"], reverse=True
        )
        events = active_events + inactive_events
        return jsonify({"events": events})
    except Exception as e:
        db.session.rollback()
        print(str(e))
        return jsonify({"error": "An error occurred while fetching user events", "details": str(e)}), 500

@bp.route('/all_events', methods=['GET'])
@jwt_required()
def get_all_events():
    try:
        events = Event.query.all()
        events = [{"id": event.id, "created_by": event.created_by.username, "name": event.name, "description": event.description, 
                   "date": event.date, "active": True if event.date > datetime.now() else False, "address": event.address, 
                   "longitude": event.geo_longitude, "latitude": event.geo_latitude, 
                   "participants": [User.query.filter_by(id=participant.user_id).first().username
                                     for participant in event.participants]} for event in events]
        
        active_events = sorted(
            [event for event in events if event["active"]],
            key=lambda x: x["date"]
        )
        inactive_events = sorted(
            [event for event in events if not event["active"]],
            key=lambda x: x["date"], reverse=True
        )
        events = active_events + inactive_events
        return jsonify({"events": events})
    except Exception as e:
        db.session.rollback()
        print(str(e))
        return jsonify({"error": "An error occurred while fetching all events", "details": str(e)}), 500


@bp.route('/add_event', methods=['POST'])
@jwt_required()
def add_event():
    try:
        print("\n\n\n\n\n", request.json, "\n\n\n\n\n")
        name = request.json["name"]
        description = request.json["description"]
        date = request.json["date"]
        address = request.json["address"]
        latitude = float(request.json["latitude"])
        longitude = float(request.json["longitude"])
        current_user = get_jwt_identity()
        date_object = datetime.strptime(date, "%Y-%m-%dT%H:%M:%S.%fZ")
        user = User.query.filter_by(username=current_user).first()
        new_event = Event(name=name, description=description, user_id=user.id, date=date_object, 
                        address=address, geo_latitude=latitude, geo_longitude=longitude)
        db.session.add(new_event)
        db.session.commit()
        event_participant = EventParticipant(user_id=user.id, event_id=new_event.id)
        db.session.add(event_participant)
        db.session.commit()
        return jsonify({"message": "Event added successfully", "event_id": new_event.id}), 201
    except Exception as e:
        db.session.rollback()
        print(str(e))
        return jsonify({"error": "An error occurred while adding an event", "details": str(e)}), 500

@bp.route('/add_participation', methods=['POST'])
@jwt_required()
def add_participation():
    try:
        print("\nJSON: ", request.json)
        event_id = request.json["event_id"]
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        event_participant = EventParticipant(event_id=event_id, user_id=user.id)
        db.session.add(event_participant)
        db.session.commit()
        return jsonify({"message": "Participant added successfully", "participant_id": user.id}), 201
    except Exception as e:
        db.session.rollback()
        print(str(e))
        return jsonify({"error": "An error occurred while adding an event paritcipation", "details": str(e)}), 500


@bp.route('/remove_participation', methods=['POST'])
@jwt_required()
def remove_participation():
    try:
        print("\nJSON: ", request.json)
        event_id = request.json["event_id"]
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        EventParticipant.query.filter_by(event_id=event_id, user_id=user.id).delete()
        db.session.commit()
        return jsonify({"message": "Participant removed successfully", "participant_id": user.id}), 201
    except Exception as e:
        db.session.rollback()
        print(str(e))
        return jsonify({"error": "An error occurred while removing an event paritcipation", "details": str(e)}), 500