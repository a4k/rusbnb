from flask_restful import Resource
from sqlalchemy.exc import SQLAlchemyError
from models import RoomModel

_rooms_pagination_parser = reqparse.RequestParser()
_rooms_pagination_parser.add_argument(
    "offset", 
    type=int, 
    required=False,
    default=0, 
    help="This field show how many rooms to skip"
)
_rooms_pagination_parser.add_argument(
    "size", 
    type=str, 
    required=False, 
    default="50",
    help="This field shows how many rooms to get per request"
)

class RoomList(Resource):
    def get(self):
        req_data = _rooms_pagination_parser.parse_args()

        if req_data['size'] == 'all':
            raw_data = RoomModel.find_all()
        else:
            raw_data = RoomModel.find_list(req_data['offset'], req_data['size'])

        data = {"rooms": []}

        for obj in raw_data:
            data['rooms'].append(obj.json())

        return data, 200
