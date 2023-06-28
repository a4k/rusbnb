from db import db


class RewiewModel(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    review = db.Column(db.String(50), nullable=False)
    rate = db.Column(db.Float, nullable=False)

    def json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'review': self.review,
            'rate': self.rate
        }

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_by_room_id(cls, room_id):
        return cls.query.filter_by(room_id=room_id).all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
