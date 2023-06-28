from flask_restful import Resource
from PIL import Image
from flask import request
from http import HTTPStatus
from sqlalchemy.exc import SQLAlchemyError

from models import RoomPhotoModel


def get_extension_from_filename(filename: str):
    return filename.split(".")[-1]


def handle_extension(current_extension: str, allowed_extensions: list) -> str:
    if current_extension not in allowed_extensions:
        extension = allowed_extensions[0]
        return extension
    return current_extension


class RoomPhoto(Resource):
    # /rooms/{room_id}/photo
    @classmethod
    def get(cls, room_id):
        all_room_photos = RoomPhotoModel.find_by_room_id(room_id)

        if all_room_photos is None:
            return {"message": "photos not found"}, HTTPStatus.NOT_FOUND

        response_json_object = {"room-photos": []}

        for photo_model_object in all_room_photos:
            response_json_object['room-photos'].append(photo_model_object.json())

        return response_json_object, HTTPStatus.OK

    @classmethod
    def post(cls, room_id):
        photo_title, photo_description = request.form.values()
        photo_file = request.files['photo']

        if photo_title is None or photo_description is None or photo_file is None:
            return {"message": "Missed argument(s)"}, HTTPStatus.BAD_REQUEST

        photo_extension = handle_extension(
            current_extension=get_extension_from_filename(filename=photo_file.filename),
            allowed_extensions=['png', 'jpg']
        )

        photo_obj = RoomPhotoModel(
            room_id=room_id,
            format=photo_extension,
            title=photo_title,
            description=photo_description
        )
        try:
            photo_obj.save_to_db()
        except SQLAlchemyError:
            return {"message": "An error occurred upload photo."}, HTTPStatus.INTERNAL_SERVER_ERROR

        with Image.open(photo_file) as photo_image:
            photo_image.save(f'room-images/{photo_obj.id}.{photo_extension}')

        return {"message": "Photo successfully uploaded"}, HTTPStatus.ACCEPTED