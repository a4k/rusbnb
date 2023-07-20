from flask import abort, request
from flask_restful import Resource, reqparse
from models import ReservationsModel
from sqlalchemy.exc import SQLAlchemyError
from datetime import date as create_date

booking_post = reqparse.RequestParser()
booking_post.add_argument(
    "user_id", type=int, required=True, help="user ID is required arg for booking"
)
booking_post.add_argument(
    "date_from", type=str, required=True, help="date from is required arg for booking"
)
booking_post.add_argument(
    "date_to", type=str, required=True, help="date to is required arg for booking"
)


def str2date(str_date, sep='/', date_format: list = None):
    if date_format is None:
        date_format = ['mm', 'dd', 'yy']
    separated_date = str_date.split(sep)
    try:
        mm = separated_date[date_format.index('mm')]
        dd = separated_date[date_format.index('dd')]
        yy = separated_date[date_format.index('yy')]
        return create_date(yy, mm, dd)
    except IndexError:
        abort(400, message="incorrect date")


class Reservations(Resource):
    # /book/user/{ user_id }

    @classmethod
    def get(cls, user_id):
        """
        This resource is designed to display a list of user bookings. It can be useful for testing.
        """
        reservations_list = ReservationsModel.find_by_id(user_id)
        if not reservations_list:
            return {"message": "User Reservations Not Found"}, 404

        json_response = {
            "books": [reservation.json() for reservation in reservations_list]
        }
        return json_response, 200


class Reservation(Resource):
    # /book/{ room_id }

    @classmethod
    def post(cls, room_id):
        """
        This resource is intended for adding a room to the reserved list. May be useful for testing
        """
        args = booking_post.parse_args()

        _format = request.args.get('format')
        _sep = request.args.get('sep')

        if _format:
            _format = _format.split('-')  # dd-mm-yy => ['dd', 'mm', 'yy']
        if not _sep:
            _sep = '/'

        # # handling room is already booked, isn't it
        #
        # reservations = ReservationsModel.books_for_room_by_id(room_id, date_from, date_to)
        # if reservation:
        #     return {"message": "room already booked for selected dates"}, 400

        date_from = str2date(args['date_from'], date_format=_format, sep=_sep)
        date_to = str2date(args['date_to'], date_format=_format, sep=_sep)
        user_id = args['user_id']  # in feature must be taken from jwt token

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
