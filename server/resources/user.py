from flask_restful import Resource, reqparse
from passlib.hash import pbkdf2_sha256

from models import UserModel

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
    def post(cls):
        # jti = get_jwt()["jti"]
        # BLOCKLIST.add(jti)
        return {"message": "Successfully logged out"}, 200


class User(Resource):
    # /user/{user_id}
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
    def delete(cls, user_id):
        user = UserModel.find_by_id(user_id)
        if not user:
            return {"message": "User Not Found"}, 404
        user.delete_from_db()
        return {"message": "User deleted."}, 200
