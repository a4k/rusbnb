from http import HTTPStatus

import requests
from flask import request
from flask_restful import Resource
from models import RoomPhotoModel


def get_extension_from_filename(filename: str):
    return filename.split(".")[-1]


def handle_extension(current_extension: str, allowed_extensions: list) -> str:
    if current_extension not in allowed_extensions:
        extension = allowed_extensions[0]
        return extension
    return current_extension


class RoomPhoto(Resource):
    # /rooms/{ room_id }/photo
    cdn_url = "https://cdn-rusbnb.exp-of-betrayal.repl.co"

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
        photo_obj.save_to_db()

        photo_filename = f'{photo_obj.id}.{photo_extension}'
        photo_file.filename = photo_filename

        files = {'file': photo_file.read()}

        r = requests.put(f'{cls.cdn_url}/put/{photo_filename}', files=files)

        return r.status_code

    @classmethod
    def delete(cls, photo_id):
        photo = RoomPhotoModel.find_by_id(photo_id)
        filename = f"{photo.id}.{photo.format}"
        photo.delete_from_db()
        requests.delete(f"{cls.cdn_url}/delete/{filename}")
        return {"message": "Successfully delete photo"}, HTTPStatus.OK
