from flask_restful import Resource, reqparse
from sqlalchemy.exc import SQLAlchemyError
from models import RoomPhotoModel
from PIL import Image


class RoomPhoto(Resource):
    photo_parser = reqparse.RequestParser()
    photo_parser.add_argument(
      'photo',
      type=werkzeug.datastructures.FileStorage,
      location='files'
    )
    photo_parser.add_argument('title', type=str)
    photo_parser.add_argument('description', type=str)
    
    def get(self, room_id):
        req_data = _rooms_photo_get_parser.parse_args()
        raw_data = RoomModel.find_by_room_id(
              req_data['room_id']
          )

        data = {"room-photos": []}

        for obj in raw_data:
            data['room-photos'].append(obj.json())

        return data, 200

    def post(self, room_id):
        args = self.photo_parser.parse_args()
        photo = args['photo']
        
        filename = photo.filename
        extension = filename.split('.')[-1]
        
        if extension != 'jpg':
            extension = 'png'
            
        photo_obj = RoomPhotoModel(
            room_id=room_id,
            format=extension,
            title=args['title'],
            description=args['description']
        )
        photo_obj.save_to_db()
        
        with Image.open('image.jpg') as im:
            im.save(f'{photo_obj.id}.{extension}')
        return 200
