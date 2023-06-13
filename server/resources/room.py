from flask_restful import Resource, reqparse
from sqlalchemy.exc import SQLAlchemyError
from models import RoomModel

_rooms_pagination_parser = reqparse.RequestParser()
_rooms_pagination_parser.add_argument(
    "offset", 
    type=int, 
    required=False,
    default="0", 
    help="This field show how many rooms to skip"
)
_rooms_pagination_parser.add_argument(
    "size", 
    type=str, 
    required=False, 
    default="50",
    help="This field shows how many rooms to get per request"
)
_rooms_pagination_parser.add_argument(
    "sort_by_cost", 
    type=bool, 
    required=False, 
    default=False,
    help="This field shows, is it necessary to sort by price of Rooms or not"
)

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
        req_data = _rooms_pagination_parser.parse_args()

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

   
class Room(Resource):
    def get(self, room_id):
        room = RoomModel.find_by_id(room_id)
        return room.json()

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
        return 200
