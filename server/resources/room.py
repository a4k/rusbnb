from flask_restful import Resource, reqparse
from http import HTTPStatus
from flask import request
from sqlalchemy.exc import SQLAlchemyError
from models import RoomModel


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


class Rooms(Resource):
    # /rooms

    @classmethod
    def get(cls):
        request_args = request.args
        if not request_args:
            query_result = RoomModel.find_all()
        else:
            if "offset" not in request_args.keys() or \
                    "size" not in request_args.keys() or \
                    "sort_by_cost" not in request_args.keys():
                return {"message": "pagination error! missed argument(s)"}, HTTPStatus.BAD_REQUEST
            query_result = RoomModel.find_list(
                request_args['offset'],
                request_args['size'],
                sort_by_cost=bool(request_args['sort_by_cost'])
            )
        if not query_result:
            return {"message": "Rooms not found"}, HTTPStatus.NOT_FOUND

        response = {"rooms": []}

        for obj in query_result:
            response['rooms'].append(obj.json())

        return response, HTTPStatus.OK

    @classmethod
    def post(cls):
        req_data = room_obj_args_parser.parse_args()

        room = RoomModel(
            title=req_data['title'],
            subtitle=req_data['subtitle'],
            description=req_data['description'],
            price=req_data['price'],
            rate=5.0
        )
        room.save_to_db()
        return {"message": "Successfully created room"}, HTTPStatus.OK


class Room(Resource):
    # /rooms/{room_id}

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
        if not room:
            return {"message": "Room not found"}, HTTPStatus.NOT_FOUND
        room.delete_from_db()
        return {"message": "Room successfully deleted"}, HTTPStatus.OK
