from flask_restful import Resource
from models import ReservationsModel
from sqlalchemy.exc import SQLAlchemyError


class Reservations(Resource):
    # /book/user/{ user_id }

    @classmethod
    def get(cls, user_id):
        """
        Данный ресурс предназначен для вывода списка бронирований пользователя. Может быть полезен для тестирования.
        This resource is designed to display a list of user bookings. It can be useful for testing.
        """
        reservations_user = ReservationsModel.find_by_id(user_id)
        if not reservations_user:
           return {"message": "User Reservations Not Found"}, 404
        return reservations_user.json(), 200


class Reservation(Resource):
    # /book/{ room_id }

    @classmethod
    def post(cls, room_id):
        """
        Данный ресурс предназначен для Dобавления комнаты в список забронированной. Может быть полезен для тестирования
        This resource is intended for adding a room to the reserved list. May be useful for testing
        """
        room = ReservationsModel.find_by_room_id(room_id)
        if room:
            return {
                "message": f"the room with the id {room_id} has already booked"}, 400
        room = ReservationsModel(room_id=room_id)
        try:
            room.save_to_db()
        except SQLAlchemyError:
            return {"message": "An error occurred creating the store."}, 500
        return room.json(), 201

