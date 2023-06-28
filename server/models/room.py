from .room_photo import RoomPhotoModel
from ..db import db


class RoomModel(db.Model):
    __tablename__ = 'Room'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(25), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    subtitle = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    rate = db.Column(db.Float, nullable=False)
    primary_image = db.Column(db.String, nullable=True)

    def json(self):
        return {
            'id': self.id,
            'title': self.title,
            'subtitle': self.subtitle,
            'description': self.description,
            'price': self.price,
            'rate': self.rate,
            'primary_image': self.get_photo()
        }

    def get_photo(self):
        return RoomPhotoModel.get_first_photo_by_room_id(self.id)
      
    def update(self, title, subtitle, description, price, image_href=None):
        self.title = title
        self.subtitle = subtitle
        self.description = description
        self.price = price
        if image_href:
            self.primary_image = image_href
    
    @classmethod
    def find_all(cls, sort_by_cost=False):
        if sort_by_cost:
            return cls.query.order_by(cls.price.asc()).all()
        return cls.query.all()

    @classmethod
    def find_list(cls, offset, size, sort_by_cost=False):
        if sort_by_cost:
            result = cls.query.order_by(cls.price.asc())
        else:
            result = cls.query
        
        return result.offset(offset).limit(size).all()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
