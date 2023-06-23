from flask_restful import Resource, reqparse
from sqlalchemy.exc import SQLAlchemyError
from models import RoomModel
from flask import request


_rooms_post_parser = reqparse.RequestParser()
_rooms_post_parser.add_argument(
    "title", type=str, required=True, help = "this field is a title of room"
)
_rooms_post_parser.add_argument(
    "subtitle", type=str, required=True, help = "this field is a subtitle of room"
)
_rooms_post_parser.add_argument(
    "description", type=str, required=True, help = "this field is a description about room"
)
_rooms_post_parser.add_argument(
    "price", type=int, required=True, help = "this field is a title of room"
)


class Rooms(Resource):
    def get(self):
        req_data = request.args

        if req_data['size'] == 'all':
            raw_data = RoomModel.find_all(sort_by_cost=bool(req_data['sort_by_cost']))
        else:
            raw_data = RoomModel.find_list(
                req_data['offset'], 
                req_data['size'],
                sort_by_cost=bool(req_data['sort_by_cost'])
            )

        data = {"rooms": []}

        for obj in raw_data:
            data['rooms'].append(obj.json())

        return data, 200

    def post(self):
        req_data = _rooms_post_parser.parse_args()
        
        room = RoomModel(
            title=req_data['title'],
            subtitle=req_data['subtitle'],
            description=req_data['description'],
            price=req_data['price'],
            rate=5.0
        )
        room.save_to_db()
        return {"message":"Successfully created room"}, 200

   
class Room(Resource):
    def get(self, room_id):
        room = RoomModel.find_by_id(room_id)
        if room:
            return room.json(), 200
        return {"message":"Room not found"}, 404

    def update(self, room_id):
        req_data = _rooms_post_parser.parse_args()

        room = RoomModel.find_by_id(room_id)
        room.update(
            title=req_data['title'],
            subtitle=req_data['subtitle'],
            description=req_data['description'],
            price=req_data['price']
        )
        room.save_to_db()
        return {"message": "Successfully updated room"}, 201
