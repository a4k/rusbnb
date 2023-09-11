from http import HTTPStatus

from flask_restful import Resource, reqparse
from models import ReviewModel

from utils import *

review_object_parser = reqparse.RequestParser()
review_object_parser.add_argument(
    "user_id", type=int, required=True
)
review_object_parser.add_argument(
    "review_text", type=str, required=True
)
review_object_parser.add_argument(
    "rate", type=float, required=True
)

review_put_object_parser = reqparse.RequestParser()
review_put_object_parser.add_argument(
    "review_text", type=str, required=True
)
review_put_object_parser.add_argument(
    "rate", type=float, required=True
)


class Reviews(Resource):
    # /reviews/{ room_id }

    @classmethod
    def get(cls, room_id: int):
        room_review_list = ReviewModel.find_by_room_id(room_id)
        if not room_review_list:
            return {"message": "reviews not found"}, HTTPStatus.NOT_FOUND
        json_response = {"reviews": [review.json() for review in room_review_list]}, HTTPStatus.OK
        return json_response
    
    @classmethod
    @jwt_required()
    def post(cls, room_id: int):
        request_args = review_object_parser.parse_args()

        review = ReviewModel(
            user_id=request_args["user_id"],
            room_id=room_id,
            review_text=request_args["review_text"],
            rate=request_args["rate"]
        )
        review.save_to_db()
        return {"message": "Successfully created review"}, HTTPStatus.ACCEPTED


class ReviewModify(Resource):
    # /reviews/{ review_id }

    @classmethod
    @jwt_required(with_payload=True)
    def put(cls, review_id: int, payload):
        request_args = review_put_object_parser.parse_args()
        review = ReviewModel.find_by_id(review_id)

        if payload["id"] != review.user_id:
            return 400, {"access denied"}
        
        review.review_text = request_args["review_text"]
        review.rate = request_args["rate"]
        return {"message": "Successfully modify review"}, HTTPStatus.ACCEPTED


    @classmethod
    @jwt_required(with_payload=True)
    def delete(cls, review_id: int, payload):
        review = ReviewModel.find_by_id(review_id)

        if payload["id"] != review.user_id:
            return 400, {"access denied"}
        
        review.delete_from_bd()
        return {"message": "Successfully delete review"}, HTTPStatus.OK
