from flask import Flask, send_file
from flask_restful import Api
from flask_cors import CORS # Cross Origin Response Control
# from waitress import serve
from resources.room import Rooms, Room
from resources.room_photo import RoomPhoto, RoomPhotoDelete
from resources.user import UserRegister, UserLogin, User, UserLogout, AvatarChange
from resources.review import Reviews, ReviewModify, AvrReview
from resources.reservations import Reservations, Reservation

from db import db


app = Flask(__name__)

CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://exp_of_betrayal:0ETIUA7hLbn0eKWpW1GJjupxFJJ9B4G7@dpg-cin8kq95rnur6sd14dk0-a.frankfurt-postgres.render.com/postgres_database_1qn7"
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
api.add_resource(AvrReview, "/avr-rate/<int:room_id>")

api.add_resource(Reservations, "/book/user/<int:user_id>")
api.add_resource(Reservation, "/book/<int:room_id>")

api.add_resource(Rooms, "/rooms")
api.add_resource(Room, "/rooms/<int:room_id>")
api.add_resource(RoomPhoto, "/rooms/<int:room_id>/photo")
api.add_resource(RoomPhotoDelete, "/rooms/<int:photo_id>/delete-photo")


@app.route("/")
def main():
    return send_file('api_dok.html')


@app.route("/api")
def throw_static_api_documentation():
    return send_file('OpenAPI.yaml')


app.run(host='0.0.0.0', port=8912)
# serve(app, host="0.0.0.0", port=80)
# serve - функция для запуска продакшен сервера. порт 80 - стандартный хттп порт,
# (можно будет заходить на http://localhost без указания порта)
