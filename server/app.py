from flask import Flask, send_file
from flask_restful import Api

from db import db
from resources.room import Rooms, Room
from resources.room_photo import RoomPhoto
from resources.store import Store, StoreList
from resources.user import UserRegister, UserLogin, User, UserLogout, AvatarChange

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:postgres@localhost/postgres"
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
api.add_resource(StoreList, "/store")
api.add_resource(Rooms, "/rooms")
api.add_resource(RoomPhoto, "/rooms/<int:room_id>/photo")
api.add_resource(Room, "/rooms/<int:room_id>")
api.add_resource(AvatarChange, "/user/<int:user_id>/avatar")


@app.route("/")
def main():
    return send_file('api_dok.html')


@app.route("/api")
def throw_static_api_documentation():
    return send_file('OpenAPI.yaml')


@app.route("/room-images/<filename>")
def throw_photo(filename):
    return send_file(f'room-images/{filename}')


app.run()
