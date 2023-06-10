from flask_restful import Resource
from models import RoomModel


class RoomList(Resource):
    def get(self):
        data = {"rooms": []}
        raw_data = roomModel.find_all()
        for obj in raw_data:
            data['rooms'].append(obj.json())
        return data, 200
