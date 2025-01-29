from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    events_created = db.relationship('Event', back_populates='created_by')
    participation = db.relationship('EventParticipant', back_populates='user') 

class Event(db.Model):
    __tablename__ = 'event'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)    
    description = db.Column(db.String(1023), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    geo_latitude = db.Column(db.Float, nullable=False)
    geo_longitude = db.Column(db.Float, nullable=False)
    created_by = db.relationship('User', back_populates='events_created')
    participants = db.relationship('EventParticipant', back_populates='event')

class EventParticipant(db.Model):
    __tablename__ = 'event_participants'
    event_id = db.Column(db.String(32), db.ForeignKey('event.id'), primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey('user.id'), primary_key=True)
    status = db.Column(db.String(50), default='pending')
    event = db.relationship('Event', back_populates='participants')
    user = db.relationship('User', back_populates='participation')

    
