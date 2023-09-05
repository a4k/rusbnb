from flask_restful import Resource, reqparse
from passlib.hash import pbkdf2_sha256
from db import db
from models import UserModel
from PIL import Image
from flask import request
from http import HTTPStatus
from utils import *


def get_extension_from_filename(filename: str):
    return filename.split(".")[-1]


def handle_extension(current_extension: str, allowed_extensions: list) -> str:
    if current_extension not in allowed_extensions:
        extension = allowed_extensions[0]
        return extension
    return current_extension


_user_parser = reqparse.RequestParser()
_user_parser.add_argument(
    "username", type=str, required=True, help="This field cannot be blank."
)
_user_parser.add_argument(
    "password", type=str, required=True, help="This field cannot be blank."
)


class UserRegister(Resource):
    # /register

    @classmethod
    def post(cls):
        data = _user_parser.parse_args()

        if UserModel.find_by_username(data["username"]):
            return {"message": "A user with that username already exists"}, 400

        user = UserModel(
            username=data["username"], password=pbkdf2_sha256.hash(data["password"])
        )
        user.save_to_db()

        return {"message": "User created successfully."}, 201


class UserLogin(Resource):
    # /login

    @classmethod
    def post(cls):
        data = _user_parser.parse_args()

        user = UserModel.find_by_username(data["username"])

        if user and pbkdf2_sha256.verify(data["password"], user.password):
            # access_token = create_access_token(identity=user.id, fresh=True)
            return {"access_token": user.id}, 200

        return {"message": "Invalid Credentials!"}, 401


class UserLogout(Resource):
    # /logout

    # @jwt_required()
    @classmethod
    @jwt_required
    def post(cls, payload):
        token = get_headers("Authorization").split(" ")[1]
        block_token(token)
        return {"message": "Successfully logged out"}, 200


class User(Resource):
    # /user/{ user_id }

    """
    This resource can be useful when testing our Flask app.
    We may not want to expose it to public users, but for the
    sake of demonstration in this course, it can be useful
    when we are manipulating data regarding the users.
    """

    @classmethod
    def get(cls, user_id):
        user = UserModel.find_by_id(user_id)
        if not user:
            return {"message": "User Not Found"}, 404
        return user.json(), 200

    @classmethod
    @jwt_required
    def delete(cls, user_id, payload):
        if payload["id"] != user_id:
            return 400, {"message": "access denied"}
            
        user = UserModel.find_by_id(user_id)
        if not user:
            return {"message": "User Not Found"}, 404
        user.delete_from_db()
        return {"message": "User deleted."}, 200

    @classmethod
    @jwt_required
    def put(cls, user_id, payload):
        if payload["id"] != user_id:
            return 400, {"message": "access denied"}
            
        req_data = _user_parser.parse_args()

        user = UserModel.find_by_id(user_id)
        user.update(
            usename=req_data['username'],
            password=req_data['password']
        )
        user.save_to_db()
        return {"message": "Successfully updated user"}, HTTPStatus.ACCEPTED


class AvatarChange(Resource):
    # /user/{ user_id }/avatar

    @classmethod
    @jwt_required
    def post(cls, user_id, payload):
        if payload["id"] != user_id:
            return 400, {"message": "access denied"}
        
        photo_file = request.files['photo']
        user = UserModel.find_by_id(user_id)
        user.name_image = str(user_id) + '.png'
        db.session.commit()

        with Image.open(photo_file) as photo_image:
            photo_image.save(f'User_avatars/{user.name_image}')

        return {"message": "Photo successfully uploaded"}, HTTPStatus.ACCEPTED
