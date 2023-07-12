from flask_restful import Resource
import requests
from flask import request
from http import HTTPStatus
from models import RoomPhotoModel

cdn_url = 'https://cdn-rusbnb.onrender.com'

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
        photo_obj.save_to_db()

        photo_filename = f'{photo_obj.id}.{photo_extension}'
        photo_file_bytes = photo_file.read()
        print(f'{cdn_url}/upload/{photo_filename}')
        response = requests.post(f'{cdn_url}/upload/{photo_filename}', files={"file": photo_file_bytes})

        return response.json(), response.status_code


class RoomPhotoDelete(Resource):
    @classmethod
    def delete(cls, photo_id):
        photo = RoomPhotoModel.find_by_id(photo_id)
        filename = photo.id + photo.format
        response = requests.delete(f"{cdn_url}/delete/{filename}")
        photo.delete_from_db()
        return response.json(), response.status_code
