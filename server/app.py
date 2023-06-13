from flask import Flask, jsonify
from flask_restful import Api
from os import environ

from db import db
from resources.user import UserRegister, UserLogin, User, UserLogout
from resources.store import Store, StoreList
from resources.room import Rooms, Room

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://postgres:postgres@localhost/postgres"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["PROPAGATE_EXCEPTIONS"] = True
db.init_app(app)
api = Api(app)


with app.app_context():
    import models  # noqa: F401

    db.create_all()


api.add_resource(UserRegister, "/register")
api.add_resource(UserLogin, "/login")
api.add_resource(UserLogout, "/logout")
api.add_resource(User, "/user/<int:user_id>")
api.add_resource(Store, "/store/<string:name>")
api.add_resource(Rooms, "/rooms")
api.add_resource(Room, "/rooms<int:room_id>")
