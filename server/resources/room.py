from http import HTTPStatus

from flask import request
from flask_restful import Resource, reqparse
from models import RoomModel, RoomLocations, RoomTypes

const_rooms_args = ["offset", "size", "location", "max_cost", "min_rate", "type", "sort_by_cost", "rooms_count"]


def validate_room_location(value):
    value_list = value.split(" ")
    if len(value_list) == 1:
        return RoomLocations(value)
    else:
        return [RoomLocations(value) for value in value_list]


def validate_room_type(value):
    value_list = value.split(" ")
    if len(value_list) == 1:
        return RoomTypes(value)
    else:
        return [RoomTypes(value) for value in value_list]


room_obj_args_parser = reqparse.RequestParser()
room_obj_args_parser.add_argument(
    "title", type=str, required=True, help="title of room is required arg"
)
room_obj_args_parser.add_argument(
    "subtitle", type=str, required=True, help="subtitle of room is required arg"
)
room_obj_args_parser.add_argument(
    "description", type=str, required=True, help="description of room is required arg"
)
room_obj_args_parser.add_argument(
    "price", type=int, required=True, help="price of room is required arg"
)
room_obj_args_parser.add_argument(
    "location", type=RoomLocations, required=True, help='{error_msg}'
)
room_obj_args_parser.add_argument(
    "type", type=RoomTypes, required=True, help="{error_msg}"
)
room_obj_args_parser.add_argument(
    "rooms_count", type=int, required=True, help="rooms_count is required arg"
)


def get_args(*params):
    return {param: request.args.get(param) for param in params}


class Rooms(Resource):
    # /rooms

    @classmethod
    def get(cls):
        if request.args:
            kwargs = get_args(*const_rooms_args)
            try:
                if kwargs['type']:
                    kwargs['type'] = validate_room_type(kwargs['type'])
                if kwargs['location']:
                    kwargs['location'] = validate_room_location(kwargs['location'])
            except ValueError as error_response:
                return {"message": str(error_response)}

            response_list = RoomModel.find_with_params(**kwargs)
        else:
            response_list = RoomModel.find_all()

        if not response_list:
            return {"message": "Rooms not found"}, HTTPStatus.NOT_FOUND

        return {"rooms": [room_object.json() for room_object in response_list]}

    @classmethod
    def post(cls):
        args = room_obj_args_parser.parse_args()

        room = RoomModel(
            title=args['title'],
            subtitle=args['subtitle'],
            description=args['description'],
            location=args['location'],
            type=args['type'],
            price=args['price'],
            rooms_count=args['rooms_count']
        )
        room.save_to_db()
        return {"message": "Successfully created room"}, HTTPStatus.OK


class Room(Resource):
    # /rooms/{ room_id }

    @classmethod
    def get(cls, room_id):
        room = RoomModel.find_by_id(room_id)
        if room:
            return room.json(), HTTPStatus.OK
        return {"message": "Room not found"}, HTTPStatus.NOT_FOUND

    @classmethod
    def put(cls, room_id):
        req_data = room_obj_args_parser.parse_args()

        room = RoomModel.find_by_id(room_id)
        room.update(
            title=req_data['title'],
            subtitle=req_data['subtitle'],
            description=req_data['description'],
            price=req_data['price']
        )
        room.save_to_db()
        return {"message": "Successfully updated room"}, HTTPStatus.ACCEPTED

    @classmethod
    def delete(cls, room_id):
        room = RoomModel.find_by_id(room_id)
        room.delete_from_db()
        return {"message": "Successfully deleted room"}, HTTPStatus.OK
