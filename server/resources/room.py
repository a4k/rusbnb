from flask_restful import Resource
from sqlalchemy.exc import SQLAlchemyError
from models import RoomModel


class RoomList(Resource):
    def get(self):
        data = {"rooms": []}
        raw_data = RoomModel.find_all()
        for obj in raw_data:
            data['rooms'].append(obj.json())
        return data, 200
