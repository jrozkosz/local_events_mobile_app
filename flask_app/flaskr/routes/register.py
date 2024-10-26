import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
# from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import db, User

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['GET'])
def register():
    user = User(username='rozki', password='boski')
    db.session.add(user)
    db.session.commit()

    return '<h2>Auth blueprint testing</h2>'