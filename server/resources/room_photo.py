from http import HTTPStatus

from flask import request
from flask_restful import Resource
from models import RoomPhotoModel
from sqlalchemy.exc import SQLAlchemyError


def get_extension_from_filename(filename: str):
    return filename.split(".")[-1]


def handle_extension(current_extension: str, allowed_extensions: list) -> str:
    if current_extension not in allowed_extensions:
        extension = allowed_extensions[0]
        return extension
    return current_extension


class RoomPhoto(Resource):
    # /rooms/{ room_id }/photo

    @classmethod
    def get(cls, room_id):
        all_room_photos = RoomPhotoModel.find_by_room_id(room_id)

        if all_room_photos is None:
            return {"message": "photos not found"}, HTTPStatus.NOT_FOUND

        response_json = {"room-photos": []}

        for photo_model_object in all_room_photos:
            response_json['room-photos'].append(photo_model_object.json())
        return response_json, HTTPStatus.OK

    @classmethod
    def post(cls, room_id):
        photo_title, photo_description = request.form.values()
        photo_file = request.files['photo']

        if None in [photo_file, photo_description, photo_title]:
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

        photo_filename = f'{photo_obj.id}.{photo_extension}'
        photo_file.filename = photo_filename

        photo_file.save("room-images/"+photo_filename)

        return {"message": "Photo successfully uploaded"}, HTTPStatus.ACCEPTED

    @classmethod
    def delete(cls, photo_id):
        photo = RoomPhotoModel.find_by_id(photo_id)
        photo.delete_from_db()
        return {"message": "Successfully delete photo"}, HTTPStatus.OK
