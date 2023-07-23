from flask import abort
from flask_restful import Resource, reqparse
from models import ReservationsModel
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime as create_date

booking_post = reqparse.RequestParser()
booking_post.add_argument(
    "user_id", type=int, required=True, help="user ID is required arg for booking"  # noqa: E501
)
booking_post.add_argument(
    "date_from", type=str, required=True, help="date from is required arg for booking"  # noqa: E501
)
booking_post.add_argument(
    "date_to", type=str, required=True, help="date to is required arg for booking"  # noqa: E501
)


def _db_obj2date(db_obj):
    return create_date(db_obj.year, db_obj.month, db_obj.day)


def _is_date_crossing(date1_from, date1_to, date2_from, date2_to):
    return not (date1_to < date2_from or date2_to < date1_from)


def _str2date(str_date):
    separated_date = str_date.split('/')
    try:
        [dd, mm, yy] = [int(el) for el in separated_date]
        return create_date(yy, mm, dd)
    except IndexError:
        abort(400, "incorrect date")


class Reservations(Resource):
    # /book/user/{ user_id }

    @classmethod
    def get(cls, user_id):
        """
        This resource is designed to display a list of user bookings. It can be useful for testing.  # noqa: E501
        """
        reservations_list = ReservationsModel.find_by_user_id(user_id)
        if not reservations_list:
            return {"message": "User Reservations Not Found"}, 404

        json_response = {
            "books": [reservation.json() for reservation in reservations_list]
        }
        return json_response, 200



class Reservation(Resource):
    # /book/{ room_id }

    @classmethod
    def get(cls, room_id):
        room_reservation__list = ReservationsModel.find_by_room_id(room_id)
        if not room_reservation__list:
            abort(404, "reservations not found")
        json_response = {
            "room-books": [room_reservation.json() for room_reservation in room_reservation__list]  # noqa: E501
        }
        return json_response, 200

    @classmethod
    def post(cls, room_id):
        """
        This resource is intended for adding a room to the reserved list. May be useful for testing  # noqa: E501
        """

        args = booking_post.parse_args()
        date_from = _str2date(args['date_from'])
        date_to = _str2date(args['date_to'])

        # in feature must be taken from jwt token
        user_id = args['user_id']  

        if date_from > date_to:
            abort(400, "date from must me later than date to")
        
        reservations_list = ReservationsModel.find_by_room_id(room_id)

        for reservation in reservations_list:
            reserv_date_from = _db_obj2date(reservation.date_from)
            reserv_date_to = _db_obj2date(reservation.date_to)

            if _is_date_crossing(reserv_date_from, reserv_date_to, date_from, date_to):  # noqa: E501
                abort(400, f"Your reservation cross with reservation than ID = {reservation.id}")  # noqa: E501

        reservation = ReservationsModel(
            date_from=date_from,
            date_to=date_to,
            user_id=user_id,
            room_id=room_id
        )
        try:
            reservation.save_to_db()
        except SQLAlchemyError:
            return {"message": "An error occurred creating the store."}, 500
        return {"message": "Successfully created reservation"}, 201


class DeleteReservation(Resource):
    @classmethod
    def delete(cls, reservation_id):
        reservation = ReservationsModel.find_by_id(reservation_id)
        if not reservation:
            return {"message": "Reservation not found"}, 404
        reservation.delete_from_db()
        return {"message": "Reservation deleted"}, 200
