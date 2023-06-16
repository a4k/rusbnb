from flask_restful import Resource, reqparse
from sqlalchemy.exc import SQLAlchemyError
from models import RoomPhotoModel

import werkzeug
from werkzeug.datastructures import FileStorage
from PIL import Image
from flask import request
from http import HTTPStatus


class RoomPhoto(Resource):
    # set const of photo file format
    allowed_photo_extensions = ['png', 'jpg']
    
    # handling GET request to /rooms/{room_id}/photo
    def get(self, room_id):
        
        # getting array of objects of class RoomPhotoModel with filter room_id = {room_id}
        photo_list = RoomPhotoModel.find_by_room_id(room_id)
        
        # creating response json template
        response = {"room-photos": []}
        
        # handle missing photo in db
        if photo_list is None:
            response['room-photos'] = "Not found"
            return response, HTTPStatus.NOT_FOUND
        
        # filling array with calling method .json() of everyone objects in array
        for photo_object in photo_list:
            response['room-photos'].append(photo_object.json())
        
        # return response json
        return response, HTTPStatus.OK

    # handling POST request to /rooms/{room_id}/photo
    def post(self, room_id):
        # get args of request
        photo_title = request.form['title']
        photo_description = request.form['description']
        photo_file = request.files['photo']
        
        #handling missing args in request
        if photo_title is None: return {"error":"photo title is requirement"}, HTTPStatus.BAD_REQUEST
        if photo_description is None: return {"error":"photo description is requirement"}, HTTPStatus.BAD_REQUEST
        if photo_file is None: return {"error":"photo file is requirement"}, HTTPStatus.BAD_REQUEST
        
        # taking filename of photo
        filename = photo_file.filename
        # taking file extension by spliting line by '.' and getting last part
        photo_extension = filename.split('.')[-1]
        
        # handle extensions that are not allowed
        if photo_extension not in self.allowed_photo_extensions: photo_extension = 'png'
        
        # creating photo object of class RoomPhotoModel with args
        photo_obj = RoomPhotoModel(
            room_id=room_id, # room_id get from request 
            format=photo_extension,
            title=photo_title,
            description=photo_description
        )
        # calling photo object method to save photo data in db
        photo_obj.save_to_db()
        
        # calling library Pillow class Image method open to open file
        with Image.open(photo) as photo_image:
            # and save it in folder room-images with name that is id of photo object and allowed extension
            photo_image.save( 'room-images/{}.{}'.format(photo_obj.id, extension) )
        
        return HTTPStatus.ACCEPTED
