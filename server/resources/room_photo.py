from flask_restful import Resource, reqparse
from sqlalchemy.exc import SQLAlchemyError
from models import RoomPhotoModel

import werkzeug
from werkzeug.datastructures import FileStorage
from PIL import Image
from flask import request


photo_parser = reqparse.RequestParser()
photo_parser.add_argument('title', type=str, required=True)
photo_parser.add_argument('description', type=str, required=True)
photo_parser.add_argument('photo', type=werkzeug.datastructures.FileStorage, location='files')


class RoomPhoto(Resource):

    def get(self, room_id):
        raw_data = RoomPhotoModel.find_by_room_id(room_id)

        data = {"room-photos": []}
        if raw_data is None:
            data['room-photos'] = "Not found"
            return data, 404

        for obj in raw_data:
            data['room-photos'].append(obj.json())

        return data, 200

    def post(self, room_id):
        title = request.form['title']
        description = request.form['description']
        photo = request.files['photo']

        filename = photo.filename
        extension = filename.split('.')[-1]
        print(extension)
        if extension != 'jpg':
            extension = 'png'
        print(extension)    
        photo_obj = RoomPhotoModel(
            room_id=room_id,
            format=extension,
            title=title,
            description=description
        )
        photo_obj.save_to_db()
        
        with Image.open(photo) as im:
            im.save(f'room-images/{photo_obj.id}.{extension}')
        return 200
