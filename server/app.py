import os

from dotenv import load_dotenv
from flask import Flask, send_file
from flask_cors import CORS  # Cross Origin Response Control
from flask_restful import Api

# from waitress import serve
from db import db
from resources.reservations import Reservations, Reservation
from resources.review import Reviews, ReviewModify
from resources.room import Rooms, Room
from resources.room_photo import RoomPhoto
from resources.user import UserRegister, UserLogin, User, UserLogout, AvatarChange
from resources.review import Reviews, ReviewModify, AvrReview
from resources.reservations import Reservations, Reservation, DeleteReservation


app = Flask(__name__)

CORS(app)
load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('PRODUCTION_DATABASE_URL')
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
api.add_resource(AvatarChange, "/user/<int:user_id>/avatar")

api.add_resource(Reviews, "/reviews/<int:room_id>")
api.add_resource(ReviewModify, "/review/<int:review_id>")

api.add_resource(Reservations, "/book/user/<int:user_id>")
api.add_resource(Reservation, "/book/<int:room_id>")
api.add_resource(DeleteReservation, "/book/<int:reservation_id>/delete")

api.add_resource(Rooms, "/rooms")
api.add_resource(Room, "/rooms/<int:room_id>")
api.add_resource(RoomPhoto, "/rooms/<int:room_id>/photo")


@app.route("/")
def main():
    return send_file('api_dok.html')


@app.route("/api")
def throw_static_api_documentation():
    return send_file('OpenAPI.yaml')


@app.route("/room-images/<filename>")
def throw_photo(filename):
    return send_file(f'room-images/{filename}')


@app.route('/files')
def files():
    return os.listdir('room-images')


app.run(host='0.0.0.0', port=6700)
# serve(app, host="0.0.0.0", port=80)
# serve - функция для запуска продакшен сервера. порт 80 - стандартный хттп порт,
# (можно будет заходить на http://localhost без указания порта)
